import React from "react";

function Rating({ rating, numReviews, caption, size }) {
	return (
		<div className="rating">
			<span>
				<i
					style={{ fontSize: size }}
					className={
						rating >= 1
							? "fa fa-star"
							: rating >= 0.5
							? "fa fa-star-half-o"
							: "fa fa-star-o"
					}
				></i>
			</span>
			<span>
				<i
					style={{ fontSize: size }}
					className={
						rating >= 2
							? "fa fa-star"
							: rating >= 1.5
							? "fa fa-star-half-o"
							: "fa fa-star-o"
					}
				></i>
			</span>
			<span>
				<i
					style={{ fontSize: size }}
					className={
						rating >= 3
							? "fa fa-star"
							: rating >= 2.5
							? "fa fa-star-half-o"
							: "fa fa-star-o"
					}
				></i>
			</span>
			<span>
				<i
					style={{ fontSize: size }}
					className={
						rating >= 4
							? "fa fa-star"
							: rating >= 3.5
							? "fa fa-star-half-o"
							: "fa fa-star-o"
					}
				></i>
			</span>
			<span>
				<i
					style={{ fontSize: size }}
					className={
						rating >= 5
							? "fa fa-star"
							: rating >= 4.5
							? "fa fa-star-half-o"
							: "fa fa-star-o"
					}
				></i>
			</span>

			<small>
				{caption ? (
					<span>{caption}</span>
				) : (
					<span>{numReviews + " reviews"}</span>
				)}
			</small>
		</div>
	);
}

export default Rating;
