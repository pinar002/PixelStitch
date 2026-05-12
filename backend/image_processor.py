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
    cropped_w = small_w * pixel_size
    cropped_h = small_h * pixel_size    
    image = image[:cropped_h, :cropped_w]
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
        (small_w * pixel_size, small_h * pixel_size),
        interpolation=cv2.INTER_NEAREST
    )

    # Convert color palette to hex codes
    hex_palette = []
    for color in centers:
        r, g, b = int(color[0]), int(color[1]), int(color[2])
        hex_code = f"#{r:02X}{g:02X}{b:02X}"
        hex_palette.append(hex_code)

    return result, hex_palette

def apply_adjustments(image: np.ndarray, brightness: int = 0, sharpness: int = 0, vibrance: int = 0) -> np.ndarray:
    """
    Applies brightness, sharpness, and vibrance settings to the image.
    All operations use NumPy vectorization and OpenCV functions.
    """

    result = image.copy()

    # --- BRIGHTNESS ---
    # We add or subtract a fixed number from the RGB values of every pixel.
    # np.clip ensures that values stay between 0 and 255.
    # For example, if brightness=30, every pixel becomes 30 units brighter.
    if brightness != 0:
        result = np.clip(result.astype(np.int16) + brightness, 0, 255).astype(np.uint8)

    # --- SHARPNESS ---
    # We use the "Unsharp Masking" method:
    # 1. Create a blurred version of the image.
    # 2. Subtract the blur from the original to find the edges.
    # 3. Add these edges back to the original to make it look sharper.
    # Higher strength means a stronger sharpening effect.
    if sharpness > 0:
        strength = sharpness / 100.0 * 1.5  # Normalize 0-100 scale to 0-1.5
        blurred = cv2.GaussianBlur(result, (0, 0), sigmaX=3)
        result = cv2.addWeighted(result, 1 + strength, blurred, -strength, 0)
        result = np.clip(result, 0, 255).astype(np.uint8)

    # --- VIBRANCE ---
    # We change the color space to HSV for this process.
    # In HSV, the 'S' channel (Saturation) represents color intensity.
    # We add or subtract the vibrance value from the S channel.
    # np.clip ensures the S values stay between 0 and 255.
    if vibrance != 0:
        hsv = cv2.cvtColor(result, cv2.COLOR_RGB2HSV).astype(np.int16)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] + vibrance * 2, 0, 255)
        result = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)

    return result

def draw_grid(image: np.ndarray, pixel_size: int, grid_color: tuple = (200, 200, 200)) -> np.ndarray:
    """
    Draws horizontal and vertical grid lines on the upscaled pixel art image.
    Each line is placed at every pixel_size interval, outlining each 'virtual pixel' cell.
    grid_color: RGB tuple for the grid line color (default: light gray)
    """
    result = image.copy()
    h, w = result.shape[:2]

    # Vertical lines 
    for x in range(0, w, pixel_size):
        cv2.line(result, (x, 0), (x, h), grid_color, 1)

    # Horizontal lines 
    for y in range(0, h, pixel_size):
        cv2.line(result, (0, y), (w, y), grid_color, 1)

    return result


def get_hex_palette(rgb_colors) -> list:
    """
    Converts a list or numpy array of RGB colors to HEX color codes.
    Each color must be in [R, G, B] format with values between 0-255.
    Returns a list of HEX strings.
    """
    hex_palette = []
    for color in rgb_colors:
        r, g, b = int(color[0]), int(color[1]), int(color[2])
        hex_palette.append(f"#{r:02X}{g:02X}{b:02X}")
    return hex_palette