import cv2
import numpy as np
from sklearn.cluster import KMeans


def process_image(image_input, pixel_size: int, max_colors: int):
    """
    Main function
    image_input: file path (str) or numpy array
    pixel_size: the number of pixels each block represents
    max_colors: max number of colours (K-Means k value)
    """

    # upload image
    if isinstance(image_input, str):
        # # Read from file path, convert BGR to RGB
        image = cv2.imread(image_input)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    else:
        image = image_input.copy()

    original_h, original_w = image.shape[:2]

    # downsampling
    small_w = max(1, original_w // pixel_size)
    small_h = max(1, original_h // pixel_size)
    small = cv2.resize(image, (small_w, small_h), interpolation=cv2.INTER_LINEAR)

    # flatten image
    pixels = small.reshape(-1, 3).astype(np.float32)

    # K-Means Clustering
    kmeans = KMeans(n_clusters=max_colors, n_init=5, max_iter=100, random_state=42)
    kmeans.fit(pixels)

    # map each pixel to its nearest cluster center (dominant color)
    labels = kmeans.predict(pixels)
    centers = kmeans.cluster_centers_.astype(np.uint8)

    # Replace pixel values with cluster centers
    quantized_small = centers[labels].reshape(small_h, small_w, 3)

    # Upsampling
    # INTER_NEAREST: use nearest-neighbor interpolation for pixel-art effect
    result = cv2.resize(
        quantized_small,
        (original_w, original_h),
        interpolation=cv2.INTER_NEAREST
    )

    # Convert color palette to hex codes
    hex_palette = []
    for color in centers:
        r, g, b = int(color[0]), int(color[1]), int(color[2])
        hex_code = f"#{r:02X}{g:02X}{b:02X}"
        hex_palette.append(hex_code)

    return result, hex_palette
