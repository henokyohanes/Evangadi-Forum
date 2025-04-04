import React, { useState, useEffect, useContext, useRef } from "react";
import axiosBaseURL, { axiosImageURL } from "../../Utility/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AppState } from "../../Routes/Router";
import { RiAccountCircleFill } from "react-icons/ri";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import Layout from "../../Components/Layout/Layout";
import NotFound from "../../Components/NotFound/NotFound";
import styles from "./Account.module.css";

const Account = () => {
  const { user, setUser, handleLogout } = useContext(AppState);
  const [image, setImage] = useState(null); // Holds the uploaded image
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [uploadimage, setUploadimage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const croppedCanvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const draw = () => {
    if (imgRef.current) {
      imgRef.current.style.transform = `translate(${imgX}px, ${imgY}px)`;
    }
  };

  useEffect(() => {
    draw(); // Re-draw image when imgX or imgY changes
  }, [imgX, imgY]);

  // Mouse Event Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !imgRef.current || !canvasRef.current) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    const newImgX = imgX + dx;
    const newImgY = imgY + dy;
    
    // Constrain movement within canvas boundaries
    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;
    const imgWidth = imgRef.current.width;
    const imgHeight = imgRef.current.height;
    
    const minX = Math.min(0, canvasWidth - imgWidth);
    const maxX = Math.max(0, canvasWidth - imgWidth);
    const minY = Math.min(0, canvasHeight - imgHeight);
    const maxY = Math.max(0, canvasHeight - imgHeight);
    
    setImgX(Math.min(maxX, Math.max(minX, newImgX)));
    setImgY(Math.min(maxY, Math.max(minY, newImgY)));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Touch Event Handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !imgRef.current || !canvasRef.current) return;

    e.preventDefault();

    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;

    const newImgX = imgX + dx;
    const newImgY = imgY + dy;

    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;
    const imgWidth = imgRef.current.width;
    const imgHeight = imgRef.current.height;

    const minX = Math.min(0, canvasWidth - imgWidth);
    const maxX = Math.max(0, canvasWidth - imgWidth);
    const minY = Math.min(0, canvasHeight - imgHeight);
    const maxY = Math.max(0, canvasHeight - imgHeight);

    setImgX(Math.min(maxX, Math.max(minX, newImgX)));
    setImgY(Math.min(maxY, Math.max(minY, newImgY)));

    setDragStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    if (imgRef.current && canvasRef.current) {
      const canvasWidth = canvasRef.current.offsetWidth;
      const canvasHeight = canvasRef.current.offsetHeight;
      setImgX((canvasWidth - imgRef.current.width) / 2);
      setImgY((canvasHeight - imgRef.current.height) / 2);
      setIsImageLoaded(true);
    }
  };

  const handleUploadClick = async () => {
    if (!isImageLoaded) {
      toast.error("Please select an image before uploading.", { autoClose: 1500 });
      return;
    }

    const croppedCanvas = document.createElement("canvas");
    const ctx = croppedCanvas.getContext("2d");
    croppedCanvas.width = 250;
    croppedCanvas.height = 250;

    ctx.beginPath();
    ctx.arc(125, 125, 125, 0, Math.PI * 2, true);
    ctx.clip();

    ctx.drawImage(
      imgRef.current,
      imgX,
      imgY,
      imgRef.current.width,
      imgRef.current.height
    );

    croppedCanvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "croppedImage.png");

      try {

        setLoading(true);
        setError(false);

        const response = await axiosBaseURL.post("/images/upload", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = response.data;
        if (result.profileImage) {
          setUser((prevUser) => ({
            ...prevUser,
            profileimg: result.profileImage,
          }));
        }

        setUploadimage(false);
        toast.success("Image uploaded successfully", { autoClose: 1500 });
      } catch (error) {
        console.error("Error uploading image:", error);
        if (error.response) {
          toast.error("Error uploading image", { autoClose: 1500 });
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }, "image/png");
  };

  const handlePicture = () => {
    setUploadimage(true);
  };

  const handleCancelClick = () => {
    setUploadimage(false);
  };

  const onLogoutClick = () => {
    handleLogout();
  };

  return (
    <Layout>
      {!error ? (<div className={styles.accountContainer}>
        <div className={styles.profile}>
          {!uploadimage ? (
            <div className={styles.profileDetails}>
              <h2>Profile Details</h2>
              <div className={styles.profileContainer}>
                <div className={styles.profileImgWrapper} onClick={handlePicture}>
                  <div className={styles.profileImage}>
                    {user.profileimg ? (
                      <img
                        src={`${axiosImageURL}${user.profileimg}`}
                        alt={user.profileimg}
                        loading="lazy"
                      />
                    ) : (
                      <RiAccountCircleFill className={styles.profileIcon} />
                    )}
                  </div>
                  <div className={styles.profileCamera}>
                    <FontAwesomeIcon icon={faCamera} className={styles.cameraIcon}/>
                  </div>
                </div>
              </div>
              <p>username <strong>{user.username}</strong> </p>
              <p>name <strong>{user.firstname} {user.lastname}</strong></p>
              <p className={styles.email}>email<strong>{user.email}</strong></p>
              <button onClick={onLogoutClick}>
                <span className={styles.icon}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.profileUpload}>
              <h2>Upload an Image</h2>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              <div
                className={styles.canvasContainer}
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  ref={imgRef}
                  src={image}
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
              </div>
              <div className={styles.uploadBtn}>
                <button onClick={handleCancelClick}>Cancel</button>
                <button onClick={handleUploadClick}>
                  {loading ? <ScaleLoader color="#fff" height={12} /> : "Upload Picture"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>) : <NotFound />}
    </Layout>
  );
};

export default Account;