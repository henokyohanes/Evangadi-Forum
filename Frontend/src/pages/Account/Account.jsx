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
  const [image, setImage] = useState(null);
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploadimage, setUploadimage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const lastTouchDistance = useRef(null);

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
      imgRef.current.style.transform = `translate(${imgX}px, ${imgY}px) scale(${scale})`;
    }
  };

  useEffect(() => {
    draw();
  }, [imgX, imgY, scale]);

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

    updateImagePosition(dx, dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const updateImagePosition = (dx, dy) => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;
    const imgWidth = imgRef.current.width * scale;
    const imgHeight = imgRef.current.height * scale;

    const minX = canvasWidth - imgWidth;
    const minY = canvasHeight - imgHeight;

    const newImgX = Math.max(minX, Math.min(0, imgX + dx));
    const newImgY = Math.max(minY, Math.min(0, imgY + dy));

    setImgX(newImgX);
    setImgY(newImgY);
  };

  const handleWheel = (e) => {
    if (!imgRef.current || !canvasRef.current) return;
    e.preventDefault();

    const scaleFactor = e.deltaY < 0 ? 1.05 : 0.95;
    const newScale = Math.max(1, Math.min(scale * scaleFactor, 3));

    setScale(newScale);
  };



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelWrapper = (e) => handleWheel(e);

    canvas.addEventListener("wheel", handleWheelWrapper, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheelWrapper);
    };
  }, [handleWheel]);



  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = getTouchDistance(e);
      lastTouchDistance.current = dist;
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const newDist = getTouchDistance(e);
      const oldDist = lastTouchDistance.current;
      if (!oldDist) return;

      const delta = newDist / oldDist;
      const newScale = Math.max(1, Math.min(scale * delta, 3));
      setScale(newScale);
      lastTouchDistance.current = newDist;
    } else if (isDragging) {
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;

      updateImagePosition(dx, dy);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  const getTouchDistance = (e) => {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleImageLoad = () => {
    if (imgRef.current && canvasRef.current) {
      const canvasWidth = canvasRef.current.offsetWidth;
      const canvasHeight = canvasRef.current.offsetHeight;
      const centeredX = (canvasWidth - imgRef.current.width) / 2;
      const centeredY = (canvasHeight - imgRef.current.height) / 2;
      setImgX(centeredX);
      setImgY(centeredY);
      setScale(1);
      setIsImageLoaded(true);
    }
  };

  const handleUploadClick = async () => {
    if (!isImageLoaded) {
      toast.error("Please select an image before uploading.", {
        autoClose: 1500,
      });
      return;
    }

    const croppedCanvas = document.createElement("canvas");
    const ctx = croppedCanvas.getContext("2d");
    croppedCanvas.width = 250;
    croppedCanvas.height = 250;

    ctx.beginPath();
    ctx.arc(125, 125, 125, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const image = imgRef.current;
    const canvas = canvasRef.current;

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    // how much the image is shifted inside the canvas
    const offsetX = imgX;
    const offsetY = imgY;

    const cropX = ((0 - offsetX) / displayWidth) * naturalWidth;
    const cropY = ((0 - offsetY) / displayHeight) * naturalHeight;
    const cropWidth = (canvasWidth / displayWidth) * naturalWidth;
    const cropHeight = (canvasHeight / displayHeight) * naturalHeight;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      croppedCanvas.width,
      croppedCanvas.height
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

  const MIN_SCALE = 1;
  const MAX_SCALE = 3;

  const handleZoomOut = () => {
    setScale((prev) => Math.max(MIN_SCALE, prev - 0.01));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(MAX_SCALE, prev + 0.01));
  };



  const handlePicture = () => setUploadimage(true);
  const handleCancelClick = () => setUploadimage(false);
  const onLogoutClick = () => handleLogout();

  return (
    <Layout>
      {!error ? (
        <div className={styles.accountContainer}>
          <div className={styles.profile}>
            {!uploadimage ? (
              <div className={styles.profileDetails}>
                <h2>Profile Details</h2>
                <div className={styles.profileContainer}>
                  <div
                    className={styles.profileImgWrapper}
                    onClick={handlePicture}
                  >
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
                      <FontAwesomeIcon
                        icon={faCamera}
                        className={styles.cameraIcon}
                      />
                    </div>
                  </div>
                </div>
                <p>
                  username <strong>{user.username}</strong>
                </p>
                <p>
                  name{" "}
                  <strong>
                    {user.firstname} {user.lastname}
                  </strong>
                </p>
                <p className={styles.email}>
                  email <strong>{user.email}</strong>
                </p>
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
                  onWheel={handleWheel}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {image && (
                    <img
                      ref={imgRef}
                      src={image}
                      onLoad={handleImageLoad}
                      loading="lazy"
                      style={{
                        position: "absolute",
                        transformOrigin: "top left",
                      }}
                      alt="Uploaded"
                    />
                  )}
                </div>
                <div className={styles.zoomSliderContainer}>
                  <button onClick={handleZoomOut} disabled={scale <= MIN_SCALE}>
                    -
                  </button>
                  <input
                    type="range"
                    id="zoomRange"
                    min="1"
                    max="3"
                    step="0.01"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className={styles.zoomSlider}
                  />
                  <button onClick={handleZoomIn} disabled={scale >= MAX_SCALE}>
                    +
                  </button>
                </div>
                <div className={styles.uploadBtn}>
                  <button onClick={handleCancelClick}>Cancel</button>
                  <button onClick={handleUploadClick}>
                    {loading ? (
                      <ScaleLoader color="#fff" height={12} />
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </Layout>
  );
};

export default Account;