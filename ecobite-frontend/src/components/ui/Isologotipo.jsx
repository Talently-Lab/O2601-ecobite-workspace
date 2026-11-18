import React, { useState, useRef, useLayoutEffect } from "react";
import logoSvg from "../../assets/EcoBite-isologotipoL.svg";
import { copywrittingMkt } from "../../constants/CopywrittingMkt";
import "./Isologotipo.css";

function Isologotipo() {
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef(null);
  const imageRef = useRef(null);
  const textWrapperRef = useRef(null);
  const measureRef = useRef(null);

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    const measureEl = measureRef.current;
    const imgEl = imageRef.current;
    if (!rootEl || !measureEl) return;

    // Medimos sobre el contenedor padre si existe, o sobre el contenedor del propio componente
    const targetContainer = rootEl.parentElement || rootEl;

    const checkFit = () => {
      const containerWidth = targetContainer.clientWidth;
      if (containerWidth <= 0) {
        setIsVisible(false);
        return;
      }

      // Descontamos el ancho del logo (imagen) y el gap entre elementos (12px por defecto)
      const imgWidth = imgEl ? imgEl.offsetWidth : 0;
      const gap = 12;
      const availableWidth = containerWidth - imgWidth - gap;

      if (availableWidth <= 0) {
        setIsVisible(false);
        return;
      }

      // 1. Asignamos el ancho disponible estimado al elemento medidor
      measureEl.style.width = `${availableWidth}px`;

      // 2. Extraemos estilos computados para métricas precisas de tipografía
      const computed = window.getComputedStyle(measureEl);
      const fontSize = parseFloat(computed.fontSize) || 12;
      let lineHeight = parseFloat(computed.lineHeight);
      if (isNaN(lineHeight)) {
        lineHeight = fontSize * 1.25;
      }

      // Altura máxima para exactamente 2 líneas (con margen de 2px para redondeo de subpíxeles)
      const maxAllowedHeight = (lineHeight * 2) + 2;
      const actualHeight = measureEl.scrollHeight;

      // 3. Cálculo dinámico de capacidad en caracteres:
      // Medimos el ancho promedio de carácter para la fuente actual usando un span de prueba
      //!!importante: Esto sirve para medir el tamaño promedio de las letras y calcular el espacio disponible"
      const testSpan = document.createElement("span");
      testSpan.style.font = computed.font || `${fontSize}px ${computed.fontFamily}`;
      testSpan.style.visibility = "hidden";
      testSpan.style.position = "absolute";
      testSpan.style.whiteSpace = "nowrap";
      testSpan.innerText = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      document.body.appendChild(testSpan);
      const avgCharWidth = testSpan.getBoundingClientRect().width / 62;
      document.body.removeChild(testSpan);

      // Caracteres estimados que entran por línea en el ancho disponible
      const charsPerLine = Math.floor(availableWidth / (avgCharWidth || (fontSize * 0.55)));
      // Capacidad total disponible en caracteres para un máximo de 2 líneas
      const totalAvailableChars = charsPerLine * 2;
      const textLength = copywrittingMkt.title.length;

      // El texto se ajusta si:
      // a) La capacidad en caracteres disponible es suficiente para el largo del texto
      // b) Y la altura real renderizada no excede las 2 líneas
      const fits = (totalAvailableChars >= textLength) && (actualHeight <= maxAllowedHeight);

      setIsVisible(fits);
    };

    // Observador para recalcular en tiempo real cuando el contenedor cambia de tamaño
    const resizeObserver = new ResizeObserver(() => {
      checkFit();
    });

    resizeObserver.observe(targetContainer);
    checkFit();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="isologotipo" ref={rootRef}>
      <img
        ref={imageRef}
        src={logoSvg}
        alt="EcoBite"
        className="isologotipo__image"
      />

      <div className="isologotipo__text-wrapper" ref={textWrapperRef}>
        {/* Solo se muestra si el cálculo dinámico determina que cabe entero en <= 2 líneas */}
        {isVisible && (
          <span className="isologotipo__title">
            {copywrittingMkt.title}
          </span>
        )}

        {/* Medidor off-screen para calcular dinámicamente si el texto desborda */}
        <span
          ref={measureRef}
          className="isologotipo__title isologotipo__title--measure"
          aria-hidden="true"
        >
          {copywrittingMkt.title}
        </span>
      </div>
    </div>
  );
}

export default Isologotipo;
