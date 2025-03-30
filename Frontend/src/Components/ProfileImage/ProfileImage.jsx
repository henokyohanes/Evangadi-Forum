import React, { useState, useEffect, useContext, useRef } from "react";
import { AppState } from "../../Routes/Router";
import axiosBaseURL, { axiosImageURL } from "../../Utility/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { RiAccountCircleFill } from "react-icons/ri";
import { toast } from "react-toastify";
import styles from "./ProfileImage.module.css";

const ProfileImage = () => {
  const { user } = useContext(AppState);
  const [image, setImage] = useState(null); // Holds the uploaded image
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Tracks if the image is loaded
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [uploadimage, setUploadimage] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const croppedCanvasRef = useRef(null);

  const notify = () => toast("Wow so easy !");
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

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setImgX((prevX) => prevX + dx);
    setImgY((prevY) => prevY + dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);






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
    if (!isDragging) return;

    e.preventDefault(); // Prevent screen scrolling

    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;

    setImgX((prevX) => prevX + dx);
    setImgY((prevY) => prevY + dy);

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
      alert("Please select and load an image before uploading.");
      return;
    } else {
      setUploadimage(false);
      toast.success("Image uploaded successfully");
    }

    const croppedCanvas = document.createElement("canvas");
    const ctx = croppedCanvas.getContext("2d");
    croppedCanvas.width = 150;
    croppedCanvas.height = 150;

    ctx.beginPath();
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
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
        const response = await axiosBaseURL.post("/images/upload", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = response.data;
        if (result.profileImage) {
          setCroppedImageUrl(result.profileImage);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }, "image/png");
  };

  const handlePicture = () => {
    setUploadimage(true);
  };

  return (
    <div className={styles.profileContainer}>
        {!uploadimage && (
      <div className={styles.profileImgWrapper}>
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
          <FontAwesomeIcon icon={faCamera} className={styles.cameraIcon} onClick={handlePicture} />
        </div>
      </div>
        )}
      {/* {!uploadimage && (
        <button className={styles.uploadBtn} onClick={handlePicture}>
          {user.profileimg ? "Change picture" : "upload picture"}
        </button>
      )} */}
      {uploadimage && (
        <div className={styles.profileUpload}>
          <p onClick={notify}>Upload an Image</p>
          <form>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </form>
          <button className={styles.changeBtn} onClick={handleUploadClick}>
            {user.profileimg ? "Change" : "Upload"}
          </button>
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
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
