// lib/contentful.js
import { createClient } from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
})

// Helper function to convert rich text to HTML
function processContentField(field) {
  if (!field) return null
  
  // If it's a rich text object (has nodeType)
  if (typeof field === 'object' && field.nodeType) {
    try {
      return documentToHtmlString(field)
    } catch (error) {
      console.error('Error converting rich text:', error)
      return JSON.stringify(field, null, 2) // Fallback to JSON string
    }
  }
  
  // If it's already a string, return as is
  if (typeof field === 'string') {
    return field
  }
  
  // For other types, convert to string
  return String(field)
}

export async function getPosts() {
  try {
    console.log('Fetching posts from Contentful...')
    console.log('Space ID:', process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID)
    console.log('Token (first 10 chars):', process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN?.substring(0, 10))
    
    // Analyze content structure first
    await analyzeContentStructure()
    
    // Get all entries without content type filter
    const entries = await client.getEntries()
    
    console.log('=== BASIC ENTRY INFO ===')
    console.log('Total entries found:', entries.items.length)
    
    if (entries.items.length > 0) {
      entries.items.forEach((item, index) => {
        console.log(`Entry ${index + 1}: ${item.fields.title || item.fields.name || 'Untitled'}`)
        console.log(`  Content Type: ${item.sys.contentType.sys.id}`)
        console.log(`  Available fields: [${Object.keys(item.fields).join(', ')}]`)
        console.log('  ---')
      })
    }
    
    // Process rich text fields for all entries
    const processedItems = entries.items.map(item => ({
      ...item,
      fields: {
        ...item.fields,
        content: processContentField(item.fields.content),
        body: processContentField(item.fields.body),
        description: processContentField(item.fields.description)
      }
    }))
    
    return processedItems
  } catch (error) {
    console.error('Contentful API Error:', error.message)
    console.error('Full error:', error)
    throw error
  }
}

export async function getPost(slug) {
  try {
    console.log(`Fetching post with slug: "${slug}"`)
    
    // Get all entries first
    const allEntries = await client.getEntries()
    
    // Try to find by slug field
    let post = allEntries.items.find(item => item.fields.slug === slug)
    
    // If not found by slug, try by ID
    if (!post) {
      post = allEntries.items.find(item => item.sys.id === slug)
    }
    
    // If still not found, try by title converted to slug
    if (!post) {
      post = allEntries.items.find(item => {
        const title = item.fields.title || item.fields.name
        if (title) {
          const titleSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          return titleSlug === slug
        }
        return false
      })
    }
    
    if (post) {
      console.log(`Found post: "${post.fields.title || post.fields.name || 'Untitled'}"`)
      
      // Process rich text fields for the single post
      post = {
        ...post,
        fields: {
          ...post.fields,
          content: processContentField(post.fields.content),
          body: processContentField(post.fields.body),
          description: processContentField(post.fields.description)
        }
      }
    } else {
      console.log(`No post found for slug: "${slug}"`)
      console.log('Available slugs/IDs:')
      allEntries.items.forEach(item => {
        console.log(`  - ${item.fields.slug || item.sys.id} (${item.fields.title || 'Untitled'})`)
      })
    }
    
    return post
  } catch (error) {
    console.error('Error fetching post:', error.message)
    throw error
  }
}

// Filter by specific content type
export async function getPostsByContentType(contentType) {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
    })
    return processEntries(entries.items)
  } catch (error) {
    console.error('Error fetching by content type:', error)
    throw error
  }
}

// Filter by publication status and content type
export async function getPublishedPosts(contentType) {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      // Only published entries (default behavior)
    })
    return processEntries(entries.items)
  } catch (error) {
    console.error('Error fetching published posts:', error)
    throw error
  }
}

// Filter by field values (e.g., featured posts, specific category)
export async function getFilteredPosts(filters = {}) {
  try {
    const query = {}
    
    // Content type filter
    if (filters.contentType) {
      query.content_type = filters.contentType
    }
    
    // Field-based filters
    if (filters.featured) {
      query['fields.featured'] = filters.featured
    }
    
    if (filters.category) {
      query['fields.category'] = filters.category
    }
    
    if (filters.status) {
      query['fields.status'] = filters.status
    }
    
    if (filters.author) {
      query['fields.author.sys.id'] = filters.author
    }
    
    // Date filters
    if (filters.publishedAfter) {
      query['fields.publishDate[gte]'] = filters.publishedAfter
    }
    
    if (filters.publishedBefore) {
      query['fields.publishDate[lte]'] = filters.publishedBefore
    }
    
    // Tags filter
    if (filters.tags) {
      query['fields.tags[in]'] = filters.tags.join(',')
    }
    
    // Ordering
    if (filters.orderBy) {
      query.order = filters.orderBy
    }
    
    // Limit results
    if (filters.limit) {
      query.limit = filters.limit
    }
    
    console.log('Query filters:', query)
    
    const entries = await client.getEntries(query)
    return processEntries(entries.items)
  } catch (error) {
    console.error('Error with filtered query:', error)
    throw error
  }
}

// Get entries by specific IDs (if your view shows specific entries)
export async function getEntriesByIds(ids) {
  try {
    const entries = await client.getEntries({
      'sys.id[in]': ids.join(',')
    })
    return processEntries(entries.items)
  } catch (error) {
    console.error('Error fetching by IDs:', error)
    throw error
  }
}

// Search within content
export async function searchPosts(searchTerm, contentType) {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      query: searchTerm, // Full-text search
    })
    return processEntries(entries.items)
  } catch (error) {
    console.error('Error searching posts:', error)
    throw error
  }
}

// Helper function to analyze available fields across all entries
export async function analyzeContentStructure() {
  try {
    const entries = await client.getEntries()
    
    const fieldAnalysis = {}
    const contentTypes = new Set()
    
    entries.items.forEach(item => {
      const contentType = item.sys.contentType.sys.id
      contentTypes.add(contentType)
      
      if (!fieldAnalysis[contentType]) {
        fieldAnalysis[contentType] = {
          count: 0,
          fields: {},
          sampleEntry: null
        }
      }
      
      fieldAnalysis[contentType].count++
      if (!fieldAnalysis[contentType].sampleEntry) {
        fieldAnalysis[contentType].sampleEntry = item.sys.id
      }
      
      Object.keys(item.fields).forEach(fieldName => {
        if (!fieldAnalysis[contentType].fields[fieldName]) {
          fieldAnalysis[contentType].fields[fieldName] = {
            count: 0,
            types: new Set(),
            samples: []
          }
        }
        
        const field = fieldAnalysis[contentType].fields[fieldName]
        field.count++
        field.types.add(typeof item.fields[fieldName])
        
        if (field.samples.length < 3) {
          let sample = item.fields[fieldName]
          if (typeof sample === 'object' && sample !== null) {
            if (sample.nodeType) {
              sample = '[Rich Text]'
            } else if (sample.sys) {
              sample = `[Reference: ${sample.sys.id}]`
            } else {
              sample = '[Object]'
            }
          }
          field.samples.push(sample)
        }
      })
    })
    
    // Convert Sets to Arrays for logging
    Object.keys(fieldAnalysis).forEach(contentType => {
      Object.keys(fieldAnalysis[contentType].fields).forEach(fieldName => {
        fieldAnalysis[contentType].fields[fieldName].types = 
          Array.from(fieldAnalysis[contentType].fields[fieldName].types)
      })
    })
    
    console.log('=== CONTENT STRUCTURE ANALYSIS ===')
    console.log('Available Content Types:', Array.from(contentTypes))
    console.log('Field Analysis:', JSON.stringify(fieldAnalysis, null, 2))
    
    return fieldAnalysis
  } catch (error) {
    console.error('Error analyzing content structure:', error)
    throw error
  }
}

// Helper function to process entries (handles rich text conversion)
function processEntries(items) {
  return items.map(item => ({
    ...item,
    fields: {
      ...item.fields,
      content: processContentField(item.fields.content),
      body: processContentField(item.fields.body),
      description: processContentField(item.fields.description)
    }
  }))
}