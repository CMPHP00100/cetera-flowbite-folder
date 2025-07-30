// app/blog/page.js - With images added to blog listing

import Link from 'next/link'
import { getPosts, getFilteredPosts } from '@/lib/contentful'
import HeroSection from "@/components/page-sections/hero";
import TypedText from "@/components/animations/typed-text";

export const metadata = {
  title: 'Blog',
  description: 'Read our latest blog posts',
}

export default async function BlogPage() {
  try {
    // First, let's get all posts to see what fields exist
    //const posts = await getPosts()
    const posts = await getFilteredPosts({
      contentType: 'pageBlogPost',
      // Add any filters you want here
      // For example:
      // contentType: 'pageBlogPost',
      // featured: true,
      // limit: 10,
      // orderBy: '-fields.publishDate'
    })

    console.log('=== Filtered Blog Posts ===')
    console.log('Posts loaded:', posts.length)

    if (posts.length === 0) {
      return (
        <>
          <HeroSection
              heading="Blog"
              subheading={
                          <TypedText
                            className="textbase"
                            texts={[
                              "If you want to read more about us...",
                              "Please take a look at some of our articles...",
                              "Check out our blogs!",
                            ]}
                          />
                        }
              callToActionButtonLink="#"
              callToActionButtonText="Get started"
              heroImage="/uploads/writing.svg"
              heroAlt="Blog Page Alt Text"
            />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">No Posts Match Your Filters</h2>
              <p className="text-yellow-700">
                Try adjusting your filter criteria or check that content exists with the specified filters.
              </p>
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <HeroSection
          heading="Blog"
          subheading={
                      <TypedText
                        className="textbase"
                        texts={[
                          "If you want to read more about us...",
                          "Please take a look at some of our articles...",
                          "Check out our blogs!",
                        ]}
                      />
                    }
          callToActionButtonLink="#"
          callToActionButtonText="Get started"
          heroImage="/uploads/writing.svg"
          heroAlt="Blog Page Alt Text"
        />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-gray-600 mb-6">Showing {posts.length} filtered posts</p>
          
          <div className="grid gap-4">
            {posts.map((post, index) => {
              const slug = post.fields.slug || 
                          post.sys.id || 
                          (post.fields.title ? 
                            post.fields.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 
                            `post-${index}`)

              // Get the featured image
              const featuredImage = post.fields.featuredImage || post.fields.image || post.fields.thumbnail
              const imageUrl = featuredImage?.fields?.file?.url
              const imageAlt = featuredImage?.fields?.description || post.fields.title || 'Blog post image'
              //const imageAlt = featuredImage?.fields?.title || featuredImage?.fields?.description || post.fields.title || 'Blog post image'
              //const imageDescription = featuredImage?.fields?.description;
              
              return (
                <article key={post.sys.id} className="border-b border-cetera-dark-blue border-opacity-[0.3] pb-4 last:border-b-0">
                  <Link href={`/blog/${slug}`} className="block text-cetera-dark-blue hover:bg-cetera-dark-blue hover:text-cetera-light-gray mx-0 px-4 py-4 rounded-lg transition-colors">
                    <div className="flex gap-6">
                      {/* Image column */}
                      {imageUrl && (
                        <div className="flex-shrink-0 w-32 h-32">
                          <img 
                            src={imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl}
                            alt={imageAlt}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Content column */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-2xl font-semibold flex-1">
                            {post.fields.title || post.fields.name || 'Untitled'}
                          </h2>
                          
                        
                                                  
                          {/* Show if featured */}
                          {post.fields.featured && (
                            <span className="bg-blue-100 text-xs px-2 py-1 rounded-full ml-4">
                              Featured
                            </span>
                          )}
                        </div>
                        {(imageAlt) && (
                            <p className="line-clamp-3 flex-1">
                              {imageAlt}
                            </p>
                          )}
                        
                        {(post.fields.publishDate || post.fields.date) && (
                          <time className="text-gray-600 text-sm block mb-2">
                            {new Date(post.fields.publishDate || post.fields.date).toLocaleDateString()}
                          </time>
                        )}
                        
                        {/* Show category if available */}
                        {post.fields.category && (
                          <div className="text-sm text-blue-600 mb-2">
                            Category: {post.fields.category}
                          </div>
                        )}
                        
                        {/* Show tags if available */}
                        {post.fields.tags && post.fields.tags.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {post.fields.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {(post.fields.excerpt || post.fields.description) && (
                          <p className="text-gray-700 line-clamp-3">
                            {post.fields.excerpt || post.fields.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error in BlogPage:', error)
    return (
      <>
        <HeroSection
          heading="Blog"
          subheading={
                      <TypedText
                        className="textbase"
                        texts={[
                          "If you want to read more about us...",
                          "Please take a look at some of our articles...",
                          "Check out our blogs!",
                        ]}
                      />
                    }
          callToActionButtonLink="#"
          callToActionButtonText="Get started"
          heroImage="/uploads/writing.svg"
          heroAlt="Blog Page Alt Text"
        />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Posts</h2>
            <p className="text-red-700">{error.message}</p>
          </div>
        </div>
      </>
    )
  }
}