function SearchPage() {
  const [searchParams] = new URLSearchParams(window.location.search);
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate search API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "Search Result 1",
          description: "This is a search result that matches your query",
          price: 19.99,
          discountPercentage: 0,
          rating: 4.0,
          stock: 50,
          category: "electronics",
          thumbnail: "https://via.placeholder.com/300x300/4ECDC4/white?text=Search+1"
        }
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">
        Search results for "{query}" ({results.length} found)
      </h1>
      
      {results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">No products found matching your search.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(prod) => CartManager.addToCart(prod)}
              isInWishlist={false}
              onToggleWishlist={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}