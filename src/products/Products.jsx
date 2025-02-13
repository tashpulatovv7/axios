import axios from 'axios';
import { useEffect, useState } from 'react';
import './products.css';

const Products = () => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState('');
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		axios.get('https://dummyjson.com/products')
			.then(res => {
				setProducts(res.data.products);
				setFilteredProducts(res.data.products);
			})
			.catch(err => console.error(err));
	}, []);

	const handleSearch = event => {
		setSearchTerm(event.target.value);
	};

	useEffect(() => {
		let updatedProducts = [...products];

		if (searchTerm) {
			updatedProducts = updatedProducts.filter(product =>
				product.title.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (sortBy) {
			updatedProducts = updatedProducts.sort((a, b) => {
				if (sortBy === 'name') {
					return sortOrder === 'asc'
						? a.title.localeCompare(b.title)
						: b.title.localeCompare(a.title);
				} else if (sortBy === 'price') {
					return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
				} else if (sortBy === 'rating') {
					return sortOrder === 'asc'
						? a.rating - b.rating
						: b.rating - a.rating;
				}
				return 0;
			});
		}

		setFilteredProducts(updatedProducts);
	}, [searchTerm, sortBy, sortOrder, products]);

	return (
		<div className={darkMode ? 'dark-mode' : ''}>
			{' '}
			<div className='filters'>
				<button onClick={() => setDarkMode(!darkMode)} className='dark-mode-toggle'>
					{darkMode ? 'Light Mode' : 'Dark Mode'}
				</button>

				<input
					type='text'
					value={searchTerm}
					onChange={handleSearch}
					placeholder='Mahsulot nomini qidirish'
				/>

				<select onChange={e => setSortBy(e.target.value)} value={sortBy}>
					<option value=''>Saralash bo'yicha</option>
					<option value='name'>Nom bo'yicha</option>
					<option value='price'>Narx bo'yicha</option>
					<option value='rating'>Rating bo'yicha</option>
				</select>

				{sortBy && (
					<select
						onChange={e => setSortOrder(e.target.value)}
						value={sortOrder}
					>
						<option value='asc'>O'sish tartibida</option>
						<option value='desc'>Kamayish tartibida</option>
					</select>
				)}
			</div>
			<ul className='cards'>
				{filteredProducts.length > 0 ? (
					filteredProducts.map(product => (
						<li className='card' key={product.id}>
							<img
								className='card-img'
								src={product.thumbnail}
								alt={product.title}
							/>
							<div className='card-content'>
								<b>{product.title}</b>
								<p>Price: {product.price}$</p>
								<p>Rating: {product.rating}</p>
							</div>
						</li>
					))
				) : (
					<p>No products found</p>
				)}
			</ul>
		</div>
	);
};

export default Products;
