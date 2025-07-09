// app/api/categories/route.js - WORKING VERSION
export async function GET() {
  // Since we know these categories work with your product search,
  // let's use them as the primary categories
  const workingCategories = [
    { id: 1, name: 'Appliances' },        // We know this works (found 1000 products)
    { id: 2, name: 'Bags Drinks' },
    { id: 3, name: 'Candy' },
    { id: 4, name: 'Dog Treats' },
    { id: 5, name: 'Electronic Organizers' },
    { id: 6, name: 'Flashlights' },
    { id: 7, name: 'Grills' },
    { id: 8, name: 'Headphones' },
    { id: 9, name: 'Inflatables' },
    { id: 10, name: 'Jackets' },
    { id: 11, name: 'Knives' },
    { id: 12, name: 'Lamps' },
    { id: 13, name: 'Music Player' },
    { id: 14, name: 'Notebooks' },
    { id: 15, name: 'Organizers' }
  ];

  console.log('Returning working categories:', workingCategories.length);
  
  return new Response(JSON.stringify(workingCategories), {
    headers: { "Content-Type": "application/json" }
  });
}