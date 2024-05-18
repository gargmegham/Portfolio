import { Button } from "@/ui/button";
import { Divider } from "@/ui/divider";
import { deviceModels } from "@/ui/model/device-models";
import { Section } from "@/ui/section";
import { Transition } from "@/ui/transition";
import { Loader } from "@/ui/loader";
import { useWindowSize } from "@/hooks";
import { Suspense, lazy, useState } from "react";
import { cssProps, media } from "@/utils/style";
import { useHydrated } from "@/hooks/useHydrated";
import styles from "./project-summary.module.css";

const Model = lazy(() =>
  import("@/ui/model").then((module) => ({ default: module.Model }))
);

export function ProjectSummary({
  visible: sectionVisible,
  sectionRef,
  index,
  title,
  description,
  model,
  buttonText,
  buttonLink,
  alternate,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { width } = useWindowSize();
  const isHydrated = useHydrated();
  const isMobile = width <= media.tablet;
  const phoneSizes = `(max-width: ${media.tablet}px) 30vw, 20vw`;
  const laptopSizes = `(max-width: ${media.tablet}px) 80vw, 40vw`;

  function handleModelLoad() {
    setModelLoaded(true);
  }

  function renderKatakana(device, visible) {
    return (
      <svg
        type="project"
        data-visible={visible}
        data-light={false}
        style={cssProps({ opacity: 1 })}
        className={styles.svg}
        data-device={device}
        viewBox="0 0 751 136"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 751 136">
          <path d="M114.7 34c9-.2 16.1-7.2 16.1-16.3 0-9-7.2-16.3-16.2-16.3A16 16 0 0 0 98.4 17H25C10.3 17 6.3 16.7.8 15.8v26c5-.6 8.5-.8 23.8-.9h60.2c-8.2 33.6-34.2 59-72.5 71 9.4 9 13.4 14.5 18.2 24.2 45.8-20.5 70.8-49.5 82.6-95.8l.9-3.7.4-1.5.2-.5.1-.6Zm-.1-24.5c4.4 0 8.2 3.8 8.2 8.2 0 4.3-3.8 8-8.2 8a8.3 8.3 0 0 1-8.2-8c0-4.4 3.7-8.2 8.2-8.2Zm104.5 111v9.7h26a194 194 0 0 1-1-23.8v-73c0-6.8.2-12 .5-17-6.8.6-9 .6-17.9.6h-77.6c-9.5 0-12.4-.1-17.4-.6.4 6 .6 10.4.6 16.6v74a176 176 0 0 1-1.2 23.5h26.2v-10h61.8Zm0-23h-61.8V40h61.8v57.5Zm45.8-68.7c12.8 4.2 28 11.7 41.3 20.6l12.8-22c-10-6-25.5-13.3-41.3-19l-12.8 20.4Zm73-17a102 102 0 0 1 12.7 23.3l14.2-5.1c-3.3-8.2-7.6-16.3-12.7-23L338 11.9Zm-84.3 52.4a174.4 174.4 0 0 1 41.2 22.5l12.3-22.6a205 205 0 0 0-40.2-20.5l-13.3 20.6ZM358.6 5a106 106 0 0 1 12.6 22.7l13.8-5c-4-9.4-8-16.2-12.8-22.3L358.6 5ZM265 134a72 72 0 0 1 10.2-2.5c53.3-9 86-33.9 104.3-79a89.8 89.8 0 0 1-21.2-18c-10.2 31-29.2 52.2-56.1 62.9a135.7 135.7 0 0 1-44.4 9.2l7.2 27.3Zm185.7-68.8h13.9c8.9 0 14.8.3 18.8.8V44c-5.6.6-9.6 1-18.8 1h-50.3c-8.6 0-13-.4-18.6-1v22c6.2-.6 9.2-.8 18.7-.8h13.3v43H406c-10.5 0-14.1-.2-19.5-1v22c7-.6 9.1-.6 19.6-.6h67c10.2 0 14.2.1 19.4.6v-22c-5.7.8-10.2 1-19.4 1h-22.5v-43Zm97.5-62a55 55 0 0 1-6.2 17.3 113.3 113.3 0 0 1-38.3 43.9 70.8 70.8 0 0 1 20.5 17.3 135 135 0 0 0 32.6-36.2l38.3-.4a101.2 101.2 0 0 1-24 40.9 126.1 126.1 0 0 1-48.1 29.4c8 7 12.5 12.6 17.3 21.8a148.7 148.7 0 0 0 53-37.1A152.2 152.2 0 0 0 623 43c2-6.5 2.4-7.4 4.2-10.3l-12-11.8a24 24 0 0 1-10.7 1.6l-36.1.4 2.9-6.1 1.3-3c.4-1 .7-1.8 1-2.2.7-1.9 1-2.3 1.7-3.6l-27.2-5Zm138 130.3a198 198 0 0 1-1-22V74a267 267 0 0 1 51.8 28l14-24.5a305.4 305.4 0 0 0-65.5-30V27.8c0-9.6.1-16.8.7-21h-27.8c.9 7.8 1 9.2 1 20.9v83.8c0 11.3-.3 15.5-.9 22h27.8Z" />
        </svg>
      </svg>
    );
  }

  function renderDetails(visible) {
    return (
      <div className="space-y-4">
        <div className="font-gotham-bold text-2xl text-teritiary-400">
          {title}
        </div>
        <Divider collapsed={!visible} collapseDelay={1000} />
        <p className="font-sans text-lg text-teritiary-300">{description}</p>
        <div>
          <Button href={buttonLink}>{buttonText}</Button>
        </div>
      </div>
    );
  }

  function renderPreview(visible) {
    return (
      <div className={styles.preview}>
        {model.type === "laptop" && (
          <>
            {renderKatakana("laptop", visible)}
            <div className={styles.model} data-device="laptop">
              {!modelLoaded && (
                <Loader
                  center
                  className={styles.loader}
                  data-visible={visible}
                />
              )}
              {isHydrated && visible && (
                <Suspense>
                  <Model
                    alt={model.alt}
                    cameraPosition={{ x: 0, y: 0, z: 8 }}
                    showDelay={700}
                    onLoad={handleModelLoad}
                    show={visible}
                    models={[
                      {
                        ...deviceModels.laptop,
                        texture: {
                          ...model.textures[0],
                          sizes: laptopSizes,
                        },
                      },
                    ]}
                  />
                </Suspense>
              )}
            </div>
          </>
        )}
        {model.type === "phone" && (
          <>
            {renderKatakana("phone", visible)}
            <div className={styles.model} data-device="phone">
              {!modelLoaded && (
                <Loader
                  center
                  className={styles.loader}
                  data-visible={visible}
                />
              )}
              {isHydrated && visible && (
                <Suspense>
                  <Model
                    alt={model.alt}
                    cameraPosition={{ x: 0, y: 0, z: 11.5 }}
                    showDelay={300}
                    onLoad={handleModelLoad}
                    show={visible}
                    models={[
                      {
                        ...deviceModels.phone,
                        position: { x: -0.6, y: 1.1, z: 0 },
                        texture: {
                          ...model.textures[0],
                          sizes: phoneSizes,
                        },
                      },
                      {
                        ...deviceModels.phone,
                        position: { x: 0.6, y: -0.5, z: 0.3 },
                        texture: {
                          ...model.textures[1],
                          sizes: phoneSizes,
                        },
                      },
                    ]}
                  />
                </Suspense>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Section
      className={styles.summary}
      data-alternate={alternate}
      data-first={index === 1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      ref={sectionRef}
      tabIndex={-1}
      {...rest}
    >
      <div className="lg:grid lg:grid-cols-2 flex flex-wrap">
        <Transition in={sectionVisible || focused}>
          {({ visible }) => (
            <>
              {!alternate && !isMobile && (
                <>
                  {renderDetails(visible)}
                  {renderPreview(visible)}
                </>
              )}
              {(alternate || isMobile) && (
                <>
                  {renderPreview(visible)}
                  {renderDetails(visible)}
                </>
              )}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
}