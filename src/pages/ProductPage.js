import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    Spin,
    Avatar,
    Tooltip,
    Button,
    Col,
    Input,
    Space,
    Popconfirm,
    Rate,
    Empty,
    Pagination,
    Modal,
  } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  MinusOutlined, PlusOutlined, StarOutlined,
} from "@ant-design/icons"
import ProductCard from "../components/ProductCard";
import thumb from "../assets/images/thumbnail.jpg";
import Review from "../components/Review";
// import { CartContext } from "../components/CartContext";
import { ToastContainer, toast } from "react-toastify";


const ProductPage = ({user}) => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const publicFolder = "http://localhost:5000/image/"
    const [product, setProduct] = useState();
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [reviewPopupVisible, setReviewPopupVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [cart, setCart] = useState([])
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    // const {addToCart} = useContext(CartContext);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const revUserId = localStorage.getItem("userId");
    const revAdmin = localStorage.getItem("role") === "Admin";


    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get("/products/"+ path);
            console.log("Current Product:", res["data"]);
            setProduct(res["data"]);
            setReviews(res["data"].reviews);
            sessionStorage.setItem("productId", res["data"]._id)
        };
        getProduct();

        const getProducts = async () => {
            const res = await axios.get("/products/");
            const new_products = res["data"]
            const filtered_products = new_products.filter(
                (new_products) => new_products._id !== product?._id
            );
            setProducts(filtered_products);
        };
        getProducts();
    }, [path, product?._id]);

    const handleBuyNow = () => {
      if (!token) {
        toast.error("Can't buy product without logging in");
        setTimeout(() => {
          navigate("/login")
        }, 2000);
        return;
      }

      const queryParams = new URLSearchParams();
      queryParams.append("productId", sessionStorage.getItem("productId"));
      queryParams.append("quantity", quantity);
      queryParams.append("totalPrice", product.price);
      
      navigate(`/buy-now/delivery?${queryParams.toString()}`);
    };
    
    const addToCart = async () => {
      // console.log("Product ID", product._id)
      if (!token) {
        toast.error("Can't add to cart without logging in");
        setTimeout(() => {
          navigate("/login")
        }, 2000);
        return;
      }

      try {
        // Send a POST request to update the user's cart on the server
        const response = await axios.put("/cart/addToCart", { productId: product._id }, config);
    
        if (response.status === 200) {
          // Update the local cart state if the server update was successful
          setCart([...cart, product]);
          toast.success("Product added to cart");
        } else {
          // Handle errors if the server update was not successful
          toast.error("Failed to add product to cart");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while adding the product to cart");
      }
    };
    
    

    const handleReviewPageChange = (page, pageSize) => {
      setCurrentPage(page);
    }

    const handleDeleteReview = async (reviewId) => {
      setSelectedReviewId(reviewId);
      setDeleteModalVisible(true);
    };

    const handleConfirmDeleteReview = async () => {
      try {
        await axios.delete(`/products/${product._id}/reviews/${selectedReviewId}`, config);
        setReviews(reviews.filter((review) => review._id !== selectedReviewId));
        setDeleteModalVisible(false);
        setSelectedReviewId(null);
        toast.success('Review deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete the review');
      }
    };
    
    const handleCancelDeleteReview = () => {
      setDeleteModalVisible(false);
      setSelectedReviewId(null);
    };
    

    const handleDeleteConfirm = () => {
      console.log(revAdmin)
      handleConfirmDeleteReview();
      setDeleteModalVisible(false);
    };
  
    const handleDeleteCancel = () => {
      setDeleteModalVisible(false);
    };
    
    const handleReviewButton = () => {
      if(!token) {
        navigate("/login")
        return;
      }
      setReviewPopupVisible(true);
    }
    

    const renderReviews = () => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedReviews = reviews.slice(startIndex, endIndex);
  
      if (paginatedReviews.length > 0) {
        return paginatedReviews.map((review, index) => (
          <div className="review_container" key={review._id}>
            <div className="review_star">
              <div className="review_name">{review.reviewerName}</div>
              <div>
                <Rate
                  allowHalf
                  disabled
                  value={review.rating}
                  style={{ color: "#F49723", fontSize: "16px" }}
                />
              </div>
            </div>
            <div className="review_body"> 
              {review.body}
              {(review.reviewer_id === revUserId || revAdmin) && (
              <div className="review_actions">
                  <Button onClick={() => handleDeleteReview(review._id)} className="delete_button" danger>Delete</Button>
              </div>
            )}
                </div>
          {index !== paginatedReviews.length - 1 && <hr className="review_line" />}
          </div>
        ));
      } else {
        return (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#888", fontWeight: "bold", fontSize: "18px" }}>
                No reviews available
              </span>
            }
            style={{
              margin: "20px 0",
            }}
          />
        );
      }
    };

    return (
        <>
          {product ? (
            <div className="product-container">
              <div className="blog-page">
                <div className="blog-top">
                  <div className="product-image-container">
                    <img
                      src={product.image ? publicFolder + product.image : thumb}
                      alt=""
                      className="product-image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", /* Ensures the image fills the container without distortion */
                        borderRadius: "12px",
                      }}
                    />
                  </div>
                  <div className="product-desc">
                    <div
                      className="flex-row"
                      style={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                      <div className="blog-title">{product.title}</div>
                    </div>  

                    <div className="blog-content">{`Rs. ${product.price}`}</div>
                    <div className="rating-count">
                        <button className="rate-btn" onClick={handleReviewButton}>Rate <StarOutlined style={{color:'white'}} /></button>
                        <span style={{marginLeft: "2rem"}}>{product.reviews.length} ratings</span>
                    </div>
                    <div className="btn-group shop">
                      <button onClick={handleBuyNow}>Buy Now</button>
                      <button onClick={addToCart}>Add to Cart</button>
                    </div>
                  </div>
                  
                </div>
                <div className="blog-bottom">
                  <div className="blog-title-other">Reviews</div>
                  <div className="reviews-section">
                    {renderReviews()}
                    <div className="pagination-container">
                      <Pagination 
                      current={currentPage}
                      total={reviews.length}
                      pageSize={pageSize}
                      onChange={handleReviewPageChange}
                      style={{marginTop: "20px"}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <Spin size="large" />
            </div>
          )}
          <Modal
            title="Confirm Delete"
            visible={deleteModalVisible}
            onOk={handleConfirmDeleteReview}
            onCancel={handleCancelDeleteReview}
            style={{ top: "50%", transform: "translateY(-50%)" }}
            okButtonProps={{ className: "ok-button" }}
            cancelButtonProps={{ className: "delete-button" }}
            footer={[
              <Button
                key="cancel"
                onClick={handleDeleteCancel}
                className="delete-button"
              >
                Cancel
              </Button>,
              <Button key="ok" onClick={handleDeleteConfirm} className="ok-button">
                <DeleteOutlined />
                Delete
              </Button>,
            ]}
          >
            <p>Are you sure you want to delete this review?</p>
          </Modal>

          <Review visible={reviewPopupVisible} onCancel={() => setReviewPopupVisible(false)} token={token} />
          <ToastContainer/>
        </>
      );
}

export default ProductPage;