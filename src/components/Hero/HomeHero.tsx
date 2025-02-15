import React, { useEffect, useState, useRef } from "react";
import heroMilkyway from "~assets/images/hero-milkyway.jpg";
import FloatingIcons from "~components/Hero/FloatingIcons";
import LoadingSpinner from "~components/LoadingSpinner/LoadingSpinner";

export default function HomeHero() {
  // 이미지 로드 및 기타 UI 요소 상태값 관리
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [typedClass, setTypedClass] = useState("");
  const [typedDot, setTypedDot] = useState("");
  const [typedMethod, setTypedMethod] = useState("");
  const [classHighlighted, setClassHighlighted] = useState(false);
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);
  const [autocompletePosition, setAutocompletePosition] = useState({
    left: 0,
    top: 0,
  });
  const [iconsVisible, setIconsVisible] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // ref 설정 (자동완성 위치 산출용)
  const codeEditorRef = useRef<HTMLDivElement>(null);
  const codeCursorRef = useRef<HTMLSpanElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const iRef = useRef(0);

  // onLoad 이벤트: 이미지 로드 후 state 업데이트 (원래 window.handleImageLoad 역할)
  function handleImageLoad() {
    setIsImageLoaded(true);
    setSpinnerVisible(false);
    setOverlayVisible(true);
  }

  useEffect(() => {
    // 이미지가 로딩되지 않았다면 타이핑 애니메이션 실행하지 않음
    if (!isImageLoaded) return;

    // 타이핑 애니메이션 종료 후 실행할 효과 (iconsVisible 노출, 코드 커서 숨김)
    function executeAstorverse() {
      setIconsVisible(true);
      setCursorVisible(false);
    }

    // 자동완성 제안 업데이트 함수 (원래 updateAutocomplete)
    function updateAutocomplete(suggestions: string[], index: number) {
      setAutocompleteSuggestions(suggestions);
      if (index === 1) {
        setAutocompleteVisible(true);
      }
      if (
        codeEditorRef.current &&
        codeCursorRef.current &&
        autocompleteRef.current
      ) {
        const editorRect = codeEditorRef.current.getBoundingClientRect();
        const cursorRect = codeCursorRef.current.getBoundingClientRect();
        let offsetX = cursorRect.left - editorRect.left;
        let offsetY = cursorRect.bottom - editorRect.top;
        const acWidth = autocompleteRef.current.offsetWidth;
        const acHeight = autocompleteRef.current.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        if (cursorRect.left + acWidth > viewportWidth) {
          offsetX = viewportWidth - acWidth - editorRect.left;
        }
        if (cursorRect.bottom + acHeight > viewportHeight) {
          offsetY = viewportHeight - acHeight - editorRect.top;
        }
        setAutocompletePosition({ left: offsetX, top: offsetY });
      }
    }

    // 클래스 자동완성 제안 (원래 showClassSuggestions)
    function showClassSuggestions(index: number, sliceText: string) {
      const classSuggestions = [
        "aggregateRoot",
        "aspect",
        "assigner",
        "astor",
        "astorAdapter",
        "astorCommand",
        "astorEntity",
        "astorEvent",
        "astorHandler",
        "astorQuery",
        "astorService",
        "astorverse",
      ];
      const sliceSuggestions = classSuggestions.filter(item =>
        item.startsWith(sliceText),
      );
      updateAutocomplete(sliceSuggestions, index);
    }

    // 메서드 자동완성 제안 (원래 showMethodSuggestions)
    function showMethodSuggestions(index: number) {
      const methodSuggestions = [
        "execute()",
        "initialize()",
        "persist()",
        "query()",
        "registerEvent()",
        "resolve()",
        "rollback()",
        "transform()",
        "validate()",
      ];
      updateAutocomplete(methodSuggestions, index);
    }

    function typeClass() {
      const classText = "astorverse";
      if (iRef.current < classText.length) {
        const sliceText = classText.slice(0, iRef.current + 1);
        showClassSuggestions(iRef.current, sliceText);
        setTypedClass(sliceText);
        iRef.current++;
        setTimeout(typeClass, 100);
      } else {
        setTimeout(() => {
          setTypedDot(".");
          setClassHighlighted(true);
          showMethodSuggestions(iRef.current);
          setTimeout(() => {
            setTypedMethod("execute()");
            setAutocompleteVisible(false);
            executeAstorverse();
          }, 1000);
        }, 500);
      }
    }

    typeClass();
  }, [isImageLoaded]);

  return (
    <div>
      <section
        id="hero-section"
        className="relative flex h-[66vh] w-full flex-col items-center justify-center overflow-hidden bg-skin-fill"
      >
        <picture>
          <img
            id="hero-img"
            src={heroMilkyway.src}
            alt="Hero 배경 이미지"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{ display: isImageLoaded ? "block" : "none" }}
            onLoad={handleImageLoad}
          />
        </picture>

        <div
          id="spinner"
          className="absolute inset-0 flex items-center justify-center bg-black"
          style={{ display: spinnerVisible ? "flex" : "none" }}
        >
          <LoadingSpinner className="h-full w-full" />
        </div>

        <div id="hero-overlay" className={overlayVisible ? "" : "hidden"}>
          <div className="absolute inset-0 z-10 bg-black opacity-60"></div>

          <div
            id="floating-icons-container"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-80"
          >
            <FloatingIcons isVisible={iconsVisible} />
          </div>

          <div className="relative z-20 mx-auto flex flex-col items-center space-y-6 px-4 text-center">
            <div
              id="code-editor"
              ref={codeEditorRef}
              className="relative block w-full whitespace-pre-wrap break-all rounded-lg p-4 text-center font-code text-2xl text-white-accent sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
            >
              <div className="flex w-full items-center justify-center">
                <span
                  id="code-class"
                  className={classHighlighted ? "text-[#a3e635]" : ""}
                >
                  {typedClass}
                </span>
                <span id="code-dot">{typedDot}</span>
                <span id="code-method">{typedMethod}</span>
                <span
                  id="code-cursor"
                  ref={codeCursorRef}
                  className="animate-blink"
                  style={{ display: cursorVisible ? "inline" : "none" }}
                >
                  |
                </span>
              </div>
              <p
                id="hero-text"
                className={`mt-4 font-sans text-xs font-light text-gray-200 sm:mt-12 sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl`}
              >
                안녕하세요!{" "}
                <span className="font-bold">백엔드 개발자 Astor, 김도훈</span>
                입니다.
                <br />
                문제의 복잡함을 꿰뚫어보고,
                <span className="font-bold">간결하고 명확한 구조</span>로
                <br />
                현실에 녹아들 수 있는 솔루션을 만듭니다.
              </p>
              <div
                id="autocomplete"
                ref={autocompleteRef}
                className={`absolute z-50 w-36 rounded bg-gray-800 p-1 text-left text-xs text-white-base ${
                  autocompleteVisible ? "" : "hidden"
                }`}
                style={{
                  left: `${autocompletePosition.left}px`,
                  top: `${autocompletePosition.top}px`,
                }}
              >
                {autocompleteSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer px-2 py-1 hover:bg-gray-600 ${
                      idx === 0 ? "bg-gray-600" : ""
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
