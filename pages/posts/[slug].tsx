import { useEffect, useState } from 'react'
import { GetStaticProps } from "next"
import Image from 'next/image'
import Link from 'next/link'

import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from "react-hook-form"

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { sanityClient, createUrlFor } from '../../sanity'

import { Post } from "../../typings"

interface Props {
  post: Post
}

type Inputs = {
    _id: string;
    name:string;
    email: string;
    comment:string;
}

const Post = ({ post }:Props) => {
  const [submitted, setSubmitted] = useState(false)
  const { register, SubmitHandler, handleSubmit, formState: { errors } } = useForm<Inputs>()

  const onSubmit : SubmitHandler<Inputs> = (data) => {
    fetch("/api/comment/create", {
      method: "POST",
      body: JSON.stringify(data)
    }).then(() => {
      setSubmitted(true)
    }).catch(err => {
      setSubmitted(false)
    })
  }

  return (
    <div>
      <Header />
      <main className="py-20">
        <Image  src={createUrlFor(post?.mainImage).url()!}
          width={380} height={350} alt="post image" 
          className="w-full h-96 object-cover"
        />
        <div className="max-w-3xl mx-auto mb-10">
          <article className="w-full mx-auto p-5 bg-secondaryColor/10">
            <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
              {post.title}
            </h1>
            <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
              {post.description}
            </h2>
            <div>
              <Image  src={createUrlFor(post.author.image).url()!}
                width={380} height={350} alt="author image" 
                className="w-12 h-12 object-cover rounded-full bg-red-400"
              />
              <p className="font-bodyFont text-base">
                Blog post by <span>{post.author.name} </span> - Published at { (new Date(post.publishedAt).toLocaleDateString())}
              </p>
            </div>

            <div className="mt-10">
              {
                post && 
                <PortableText 
                  content={post.body} 
                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "6xdumv1x"}
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
                  
                  serializers={{
                    h1: (props:any) => (<h1 className="text-3xl font-bold my-5 font-titleFont" {...props} />),
                    h2: (props:any) => (<h2 className="text-2xl font-bold my-5 font-titleFont" {...props} />),
                    h3: (props:any) => (<h3 className="text-xl font-bold my-5 font-titleFont" {...props} />),
                    li: ({children}:any) => (<li className="ml-4 list-disc">{children}</li>),
                    link: ({href, children}:any) => (<a href={href} className="text-cyan-500 hover:underline">{children}</a>)
                  }}
                />
              }
            </div>
          </article>
          <hr className="max-w-lg my-5 mx-auto border-[1px] border-secondaryColor" />
          <div>
            <p className="text-xs text-secondaryColor uppercase font-titleFont font-bold">Enjoyed this article?</p>
            <h3 className="font-titleFont text-3xl font-bold">Leave a comment below</h3>
            <hr className="py-3 mt-2" />
            <form className="mt-7 flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
              {/* <input type="text" defaultValue={post._id} {...register("_id")} hidden  /> */}

              <div className="flex flex-col">
                <label htmlFor="name" className="font-titleFont font-semibold text-base">Name</label>
                <input id="name" type="text" 
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none
                  focus-within:shadow-xl shadow-secondaryColor"
                  placeholder="Enter your name" 
                  {...register("name", { required: true})}
                />
                {errors?.name && <span>My name is Destiny, I will like to know yours</span>}
              </div>

              <div className="flex flex-col">
                <label htmlFor="name" className="font-titleFont font-semibold text-base">Email</label>
                <input id="name" type="email" 
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none
                  focus-within:shadow-xl shadow-secondaryColor"
                  placeholder="Enter your email" 
                  {...register("email", { required: true})}
                />
                {errors.email && <span>Your email pleaseeeee</span>}
              </div>


              <div className="flex flex-col">
                <label htmlFor="name" className="font-titleFont font-semibold text-base">Comment</label>
                <textarea id="name"
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none
                  focus-within:shadow-xl shadow-secondaryColor"
                  placeholder="what do you think?" 
                  {...register("comment", { required: true})}
                />
                {errors.comment && <span>Can't really share empty thoughts</span>}
              </div>

              <button 
                className="w-full bg-bgColor text-white text-base font-titleFont
                  font-semibold tracking-wider uppercase py-2 rounded-sm
                  hover:bg-secondaryColor duration-300" 
                type="submit">
                  Share your thought
              </button>
            </form>
            <div className="w-full flex flex-col p-10 my-10 mx-auto shadow-bgColor shadow-lg space-y-2">
              <h3 className="text-3xl font-titleFont font-semibold">
                Comments
              </h3>
              <hr />
              {
                post.comments.map((comment) => (
                  <div key={comment.id}>
                    <p><span className="text-secondaryColor">{comment.name || "Unkown"}</span>{" "}
                    {comment.comment}</p>
                  </div>
                ))
              }
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
    _id,
      slug{
        current
      }
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post:Post) => ({
    params: {
      slug: post.slug.current
    }
  }))

  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
      publishedAt,
      title,
      author -> {
        name,
        image
      },
      "comments": *[_type == "comment" && post.ref == ^._id && approved = true],
      description,
      mainImage,
      slug,
      body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  })

  if(!post){
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60
  }
}
