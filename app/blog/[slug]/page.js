// app/blog/[slug]/page.js
import { getPosts } from '@/lib/contentful'
import { notFound } from 'next/navigation'

// Helper function to find a post by slug from all posts
async function findPostBySlug(slug) {
  try {
    const allPosts = await getPosts()
    
    console.log(`=== findPostBySlug DEBUG ===`)
    console.log(`Looking for slug: "${slug}"`)
    console.log(`Total posts available: ${allPosts.length}`)
    
    // Try to find by slug field
    let post = allPosts.find(item => item.fields.slug === slug)
    if (post) {
      console.log(`Found by slug field: ${post.fields.title}`)
      return post
    }
    
    // Try to find by system ID
    post = allPosts.find(item => item.sys.id === slug)
    if (post) {
      console.log(`Found by system ID: ${post.fields.title}`)
      return post
    }
    
    // Try to find by title converted to slug
    post = allPosts.find(item => {
      const title = item.fields.title || item.fields.name
      if (title) {
        const titleSlug = title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
        return titleSlug === slug
      }
      return false
    })
    
    if (post) {
      console.log(`Found by title slug: ${post.fields.title}`)
      return post
    }
    
    console.log(`No post found for slug: "${slug}"`)
    console.log('Available options:')
    allPosts.forEach((item, index) => {
      const titleSlug = item.fields.title ? 
        item.fields.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 
        'no-title'
      console.log(`  ${index + 1}. slug="${item.fields.slug || 'none'}" id="${item.sys.id}" title-slug="${titleSlug}" title="${item.fields.title || 'Untitled'}"`)
    })
    
    return null
  } catch (error) {
    console.error('Error in findPostBySlug:', error)
    throw error
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    
    console.log('=== generateStaticParams DEBUG ===')
    console.log('Total posts for static generation:', posts.length)
    
    if (posts.length === 0) {
      console.log('No posts found for static generation')
      return []
    }
    
    const params = posts.map((post, index) => {
      // Generate slug using the same logic as the blog listing
      let slug = post.fields.slug || 
                 post.sys.id || 
                 (post.fields.title ? 
                   post.fields.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 
                   `post-${index}`)
      
      console.log(`Post ${index + 1}:`)
      console.log(`  Title: ${post.fields.title || post.fields.name || 'No title'}`)
      console.log(`  Content Type: ${post.sys.contentType.sys.id}`)
      console.log(`  Slug field: ${post.fields.slug || 'No slug field'}`)
      console.log(`  System ID: ${post.sys.id}`)
      console.log(`  Generated slug: "${slug}"`)
      console.log(`  Available fields: [${Object.keys(post.fields).join(', ')}]`)
      console.log('  ---')
      
      return { slug }
    })
    
    console.log('Generated static params:', params)
    return params
    
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    console.error('Full error:', error)
    return []
  }
}

export async function generateMetadata({ params }) {
  try {
    const post = await findPostBySlug(params.slug)
    
    if (!post) {
      return {
        title: 'Post Not Found'
      }
    }

    return {
      title: post.fields.title || post.fields.name || 'Blog Post',
      description: post.fields.excerpt || post.fields.description || post.fields.summary || 'Blog post content',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Error Loading Post'
    }
  }
}

export default async function BlogPost({ params }) {
  try {
    console.log(`=== BlogPost Component ===`)
    console.log(`Requested slug: "${params.slug}"`)
    
    const post = await findPostBySlug(params.slug)
    
    if (!post) {
      console.log('Post not found, calling notFound()')
      notFound()
    }

    console.log(`Rendering post: "${post.fields.title || post.fields.name || 'Untitled'}"`)
    console.log(`Post content type: ${post.sys.contentType.sys.id}`)
    console.log(`Post fields: [${Object.keys(post.fields).join(', ')}]`)

    // Check what content fields are available
    const hasContent = post.fields.content
    const hasBody = post.fields.body  
    const hasDescription = post.fields.description
    const hasSummary = post.fields.summary
    const hasText = post.fields.text
    
    console.log('Content field analysis:')
    console.log(`  content: ${hasContent ? 'YES' : 'NO'}`)
    console.log(`  body: ${hasBody ? 'YES' : 'NO'}`)
    console.log(`  description: ${hasDescription ? 'YES' : 'NO'}`)
    console.log(`  summary: ${hasSummary ? 'YES' : 'NO'}`)
    console.log(`  text: ${hasText ? 'YES' : 'NO'}`)

    return (
      <article className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12 pb-8">
        <header className="mb-4">
          <h1 className="text-4xl font-bold mb-2 font-cetera-josefin text-cetera-dark-blue">
            {post.fields.title || post.fields.name || 'Untitled'}
          </h1>
          
          {/* Try different date field names */}
          {post.fields.publishDate && (
            <time className="text-gray-600 block mb-2">
              Published: {new Date(post.fields.publishDate).toLocaleDateString()}
            </time>
          )}
          
          {post.fields.date && (
            <time className="text-gray-600 block mb-2">
              Date: {new Date(post.fields.date).toLocaleDateString()}
            </time>
          )}
          
          {post.fields.createdAt && (
            <time className="text-gray-600 block mb-2">
              Created: {new Date(post.fields.createdAt).toLocaleDateString()}
            </time>
          )}
          
          {/* System created date as fallback */}
          <time className="text-gray-500 text-sm">
            Created: {new Date(post.sys.createdAt).toLocaleDateString()}
          </time>
        </header>
        
        {/* Featured image with multiple possible field names */}
        {post.fields.featuredImage && (
          <img 
            src={post.fields.featuredImage.fields?.file?.url}
            alt={post.fields.featuredImage.fields?.title || 'Featured image'}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        
        {post.fields.image && !post.fields.featuredImage && (
          <img 
            src={post.fields.image.fields?.file?.url}
            alt={post.fields.image.fields?.title || 'Post image'}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        
        <div className="prose lg:prose-xl max-w-none">
          <div className="mb-4">
            <a href="/blog" className="text-cetera-mono-orange hover:text-cetera-dark-blue underline">
              ← Back to Blog
            </a>
          </div>

          {/* Try different content field names in order of preference */}
          {post.fields.content && (
            <div>
              {/*<h3 className="text-sm text-gray-500 mb-2">Content:</h3>*/}
              <div dangerouslySetInnerHTML={{ __html: post.fields.content }} />
            </div>
          )}
          
          {post.fields.body && !post.fields.content && (
            <div>
              {/*<h3 className="text-sm text-gray-500 mb-2">Body:</h3>*/}
              <div dangerouslySetInnerHTML={{ __html: post.fields.body }} />
            </div>
          )}
          
          {post.fields.text && !post.fields.content && !post.fields.body && (
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Text:</h3>
              <div dangerouslySetInnerHTML={{ __html: post.fields.text }} />
            </div>
          )}
          
          {post.fields.description && !post.fields.content && !post.fields.body && !post.fields.text && (
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Description:</h3>
              <div dangerouslySetInnerHTML={{ __html: post.fields.description }} />
            </div>
          )}
          
          {post.fields.summary && !post.fields.content && !post.fields.body && !post.fields.text && !post.fields.description && (
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Summary:</h3>
              <div dangerouslySetInnerHTML={{ __html: post.fields.summary }} />
            </div>
          )}
          
          {!hasContent && !hasBody && !hasText && !hasDescription && !hasSummary && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800 font-semibold mb-2">No content field found</p>
              <p className="text-yellow-700 mb-4">This post doesn't have any recognizable content fields.</p>
              
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-yellow-600 font-medium">
                  Debug: Show all available fields
                </summary>
                <div className="mt-2 space-y-2">
                  {Object.entries(post.fields).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <strong className="text-yellow-800">{key}:</strong>
                      <span className="ml-2 text-yellow-600">
                        {typeof value === 'string' ? 
                          value.substring(0, 100) + (value.length > 100 ? '...' : '') :
                          typeof value === 'object' && value !== null ?
                            (value.nodeType ? '[Rich Text Object]' : 
                             value.sys ? `[Reference: ${value.sys.id}]` : '[Object]') :
                            String(value)
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
        
        {/* Debug info */}
        {/*<details className="mt-8 text-sm text-gray-500">
          <summary className="cursor-pointer">Debug Info</summary>
          <div className="mt-2 bg-gray-50 p-4 rounded text-xs">
            <p><strong>Content Type:</strong> {post.sys.contentType.sys.id}</p>
            <p><strong>Entry ID:</strong> {post.sys.id}</p>
            <p><strong>Created:</strong> {post.sys.createdAt}</p>
            <p><strong>Updated:</strong> {post.sys.updatedAt}</p>
            <p><strong>Available Fields:</strong> {Object.keys(post.fields).join(', ')}</p>
          </div>
        </details>*/}
      </article>
    )
  } catch (error) {
    console.error('Error in BlogPost component:', error)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Error Loading Post</h1>
        <p className="text-red-600 mb-4">{error.message}</p>
        
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-red-600 font-medium">
            Show Technical Details
          </summary>
          <pre className="mt-2 text-xs bg-red-50 p-4 rounded overflow-auto text-red-800">
            {error.stack}
          </pre>
        </details>
        
        <div className="mt-6">
          <a href="/blog" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Blog
          </a>
        </div>
      </div>
    )
  }
}