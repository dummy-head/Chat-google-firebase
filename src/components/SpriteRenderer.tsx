import { FC, HTMLProps, useEffect, useRef, useState } from "react";

interface SpriteRendererProps {
  src: string;
  size?: number;
  runOnHover?: boolean;
  delay?: number;
}

const SpriteRenderer: FC<HTMLProps<HTMLDivElement> & SpriteRendererProps> = ({
  src,
  size = 60,
  runOnHover = false,
  delay = 100,
  ...others
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [backgroundPosition, setBackgroundPosition] = useState("");
  const [loaded, setLoaded] = useState(false);
  const intervalId = useRef<any>(null);

  useEffect(() => {
    setLoaded(false);

    const img = new Image();
    img.src = src;

    img.addEventListener(
      "load",
      () => {
        setLoaded(true);

        let stepCount = Math.ceil(img.width / img.height);

        let count = 0;

        if (runOnHover) {
          containerRef.current?.addEventListener("mouseenter", () => {
            intervalId.current = setInterval(() => {
              if (!containerRef.current) clearInterval(intervalId.current);

              setBackgroundPosition(
                `${Math.round(-((count % stepCount) + 1) * size)}px 50%`
              );

              count++;
            }, delay);
          });

          containerRef.current?.addEventListener("mouseleave", () => {
            if (intervalId.current) clearInterval(intervalId.current);

            count = 0;

            setBackgroundPosition(`0px 50%`);
          });
        } else {
          intervalId.current = setInterval(() => {
            if (!containerRef.current) clearInterval(intervalId.current);

            setBackgroundPosition(
              `${Math.round(-((count % stepCount) + 1) * size)}px 50%`
            );

            count++;
          }, delay);
        }
      },
      { once: true }
    );

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        backgroundPosition,
        opacity: loaded ? 1 : 0,
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
      }}
      {...others}
    ></div>
  );
};

export default SpriteRenderer;
