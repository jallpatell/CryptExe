import React, { useEffect } from "react";

const LottieAnimation = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js";
    script.type = "module";
    document.body.appendChild(script);
  }, []);

  return (
    <dotlottie-wc
      src="https://lottie.host/d4c8fa29-3305-4525-954f-a63164d6c920/9So6Orqsd5.lottie"
      style={{ width: "400px", height: "400px" }}
      speed="1"
      autoplay
      loop
    ></dotlottie-wc>
  );
};

export default LottieAnimation;
