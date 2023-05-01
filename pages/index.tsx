import Head from "next/head";
import Image from 'next/image'
import Link from 'next/link'

import "slick-carousel/slick/slick.css";
import Banner from "../components/Banner";
import BannerBottom from "../components/BannerBottom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { sanityClient, createUrlFor } from '../sanity'
import { Post } from "../typings"

interface Props {
  posts: [Post]
}

export default function Home({ posts }:Props) {
  
  return (
    <div>
      <Head>
        <title>My Blog | Explore the new horizon</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      <main className="font-bodyFont">
        {/* ============ Header Start here ============ */}
        <Header />
        {/* ============ Header End here ============== */}
        {/* ============ Banner Start here ============ */}
        <Banner />
        {/* ============ Banner End here ============== */}
        <div className="max-w-7xl mx-auto h-60 relative">
          <BannerBottom />
        </div>
        {/* ============ Banner-Bottom End here ======= */}
        {/* ============ Post Part Start here ========= */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6">
          {
            posts && posts.map((post, index) => (
              <Link key={post._id} href={`/posts/${post.slug.current}`}>
                <div className="border-[1px] border-secondaryColor border-opacity-40 h-[450px] group">
                  <div className="h-3/5 w-full overflow-hidden">
                    <Image  src={createUrlFor(post.mainImage).url()}
                     width={380} height={350} alt="post image" 
                     className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-110 duration-300"
                    />
                  </div>
                  <div className="h-2/5 w-full flex flex-col justify-center">
                    <div className="flex justify-between items-center px-4 py-1 border-b-[1px] border-b-gray-500">
                      <p>{post.title}</p>
                      <Image  src={createUrlFor(post.author.image).url()}
                        width={380} height={350} alt="author" 
                        className="w-12 h-12 rounded-full object-cover"
                        />
                    </div>

                    <p className="py-2 px-4 text-base">
                      {post.description.substring(0,60)}... by -{" "}
                      <span className="font-bold">{post.author.name}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
        {/* ============ Post Part End here =========== */}
        {/* ============ Footer Start here============= */}
        <Footer />
        {/* ============ Footer End here ============== */}
      </main>
    </div>
  );
}

export const getServerSideProps =async (params:type) => {
  const query = `*[_type == "post"] {
    _id,
      title,
      author -> {
        name,
        image
      },
      description,
      mainImage,
      slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts
    }
  }

}
