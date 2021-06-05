import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import { isAdmin, isAuth } from "../utils.js";

const productRouter = express.Router();

productRouter.get(
	"/",
	expressAsyncHandler(async (req, res) => {
		const name = req.query.name || "";
		const category = req.query.category || "";
		const edition = req.query.edition || "";
		const gender = req.query.gender || "";
		const order = req.query.order || "";
		const min =
			req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
		const max =
			req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
		const rating =
			req.query.rating && Number(req.query.rating) !== 0
				? Number(req.query.rating)
				: 0;

		const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
		const categoryFilter = category ? { category } : {};
		const editionFilter = edition ? { edition } : {};
		const genderFilter = gender ? { gender } : {};
		const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
		const ratingFilter = rating ? { rating: { $gte: rating } } : {};
		const sortOrder =
			order === "lowest"
				? { price: 1 }
				: order === "highest"
				? { price: -1 }
				: order === "toprated"
				? { rating: -1 }
				: { _id: -1 };

		console.log(`query: -->`, {
			...nameFilter,
			...categoryFilter,
			...editionFilter,
			...genderFilter,
			...priceFilter,
			...ratingFilter,
		});

		const products = await Product.find({
			...nameFilter,
			...categoryFilter,
			...editionFilter,
			...genderFilter,
			...priceFilter,
			...ratingFilter,
		}).sort(sortOrder);
		res.send(products);
	})
);

productRouter.get(
	"/categories",
	expressAsyncHandler(async (req, res) => {
		const categories = await Product.find().distinct("category");
		res.send(categories);
	})
);

productRouter.get(
	"/editions",
	expressAsyncHandler(async (req, res) => {
		const editions = await Product.find().distinct("edition");
		res.send(editions);
	})
);

productRouter.post(
	"/",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const product = new Product({
			name: "Sample Product " + Date.now(),
			image: "/images/p1.jpg",
			brand: "Sample XXX",
			edition: "Sample XXX",
			category: "Sample XXX",
			description: {
				desc: "Sample Description",
				material: {
					title: "Sample Title",
					subtitle: "Sample Subtitle",
				},
				fit: {
					title: "REGULAR",
					subtitle: "Fits just right - not too tight, not too loose.",
				},
			},
			price: 0,
			discount: 0,
			countInStock: 0,
			rating: 0,
			numReviews: 0,
			gender: "male",
		});
		const createdProduct = await product.save();
		res.send({ message: "Product Created", product: createdProduct });
	})
);

productRouter.get(
	"/seed",
	expressAsyncHandler(async (req, res) => {
		await Product.remove({});
		const createdProducts = await Product.insertMany(data.products);
		res.send({ createdProducts });
	})
);

productRouter.get(
	"/:id",
	expressAsyncHandler(async (req, res) => {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.send(product);
		} else {
			res.status(404).send({ message: "Product Not Found" });
		}
	})
);

productRouter.put(
	"/:id",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const productId = req.params.id;
		const product = await Product.findById(productId);
		if (product) {
			product.name = req.body.name;
			product.image = req.body.image;
			product.brand = req.body.brand;
			product.edition = req.body.edition;
			product.category = req.body.category;
			product.description = {
				desc: req.body.desc,
				material: {
					title: req.body.materialTitle,
					subtitle: req.body.materialSubTitle,
				},
				fit: {
					title: req.body.fitTitle,
					subtitle: req.body.fitSubTitle,
				},
			};
			product.price = req.body.price;
			product.discount = req.body.discount;
			product.sizeInStock = req.body.sizeInStock;
			product.countInStock = req.body.countInStock;
			product.gender = req.body.gender;
			const updatedProduct = await product.save();
			res.send({ message: "Product Updated", product: updatedProduct });
		} else {
			res.status(404).send({ message: "Product Not Found" });
		}
	})
);

productRouter.delete(
	"/:id",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const productId = req.params.id;
		const product = await Product.findById(productId);
		if (product) {
			const removedProduct = await product.remove();
			res.send({ message: "Product Deleted", product: removedProduct });
		} else {
			res.status(404).send({ message: "Product Not Found" });
		}
	})
);

export default productRouter;
