"use server";

interface HandwritingResponse {
  success: boolean;
  candidates: string[];
  error?: string;
}

/**
 * Recognizes Japanese characters or words from coordinate strokes.
 * 
 * @param ink Array of strokes, where each stroke is [xCoordinates[], yCoordinates[], timestamps[]]
 * @param width Width of the drawing area in pixels
 * @param height Height of the drawing area in pixels
 * @param language Language code (default 'ja' for Japanese)
 */
export async function recognizeHandwriting(
  ink: number[][][],
  width: number,
  height: number,
  language: string = "ja"
): Promise<HandwritingResponse> {
  try {
    const itc = language === "ja" ? "ja-t-i0-handwrit" : "en-t-i0-handwrit";
    const url = `https://inputtools.google.com/request?itc=${itc}&app=translate`;

    const payload = {
      app_version: 0.4,
      api_level: "537.36",
      device: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      input_type: 0,
      options: "enable_pre_space",
      requests: [
        {
          writing_guide: {
            writing_area_width: Math.round(width) || 300,
            writing_area_height: Math.round(height) || 300,
          },
          language: language,
          ink: ink,
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Google Input Tools API returned status ${res.status}`);
    }

    const data = await res.json();
    
    if (
      Array.isArray(data) &&
      data[0] === "SUCCESS" &&
      data[1] &&
      data[1][0] &&
      Array.isArray(data[1][0][1])
    ) {
      const candidates: string[] = data[1][0][1];
      return { success: true, candidates };
    }

    return { success: false, error: "No candidates recognized", candidates: [] };
  } catch (error: any) {
    console.error("Error in recognizeHandwriting server action:", error);
    return {
      success: false,
      error: error.message || "Failed to recognize handwriting",
      candidates: [],
    };
  }
}
