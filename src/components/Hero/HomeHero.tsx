import React, { useEffect, useState, useRef } from "react";
import heroMilkyway from "~assets/images/hero-milkyway.jpg";
import FloatingIcons from "~components/Hero/FloatingIcons";
import LoadingSpinner from "~components/LoadingSpinner/LoadingSpinner";

type AutoCompleteType = "class" | "method";

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
  const [classText, setClassText] = useState("astorverse");
  // typedIndex를 상태로 관리하여 클래스 타이핑 진행 상황을 기록합니다.
  const [typedIndex, setTypedIndex] = useState(0);
  // autoComplete의 종류: class 또는 method
  const [autocompleteType, setAutocompleteType] =
    useState<AutoCompleteType>("class");

  // ref 설정 (자동완성 위치 산출용)
  const codeEditorRef = useRef<HTMLDivElement>(null);
  const codeCursorRef = useRef<HTMLSpanElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // onLoad 이벤트: 이미지 로드 후 state 업데이트
  function handleImageLoad() {
    setIsImageLoaded(true);
    setSpinnerVisible(false);
    setOverlayVisible(true);
  }

  // 자동완성 업데이트 함수 수정
  function updateAutocomplete(suggestions: string[], index: number) {
    setAutocompleteSuggestions(suggestions);
    // 클래스 타입인 경우, 인덱스가 1일 때만 보이도록 하고,
    // 메서드 타입인 경우에는 항상 보이도록 설정합니다.
    if (
      (autocompleteType === "class" && index === 1) ||
      autocompleteType === "method"
    ) {
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

  // 클래스 자동완성 제안
  function showClassSuggestions(index: number, sliceText: string) {
    setAutocompleteType("class");
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

  // 메서드 자동완성 제안
  function showMethodSuggestions(index: number) {
    setAutocompleteType("method");
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

  // 클래스 타이핑 효과 (상태 업데이트 기반)
  useEffect(() => {
    if (!isImageLoaded) return;

    if (typedIndex < classText.length) {
      const sliceText = classText.slice(0, typedIndex + 1);
      showClassSuggestions(typedIndex, sliceText);
      setTypedClass(sliceText);
      const timer = setTimeout(() => {
        setTypedIndex(typedIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // 클래스 타이핑 완료 후 후속 효과
      const timer = setTimeout(() => {
        setTypedDot(".");
        setClassHighlighted(true);
        showMethodSuggestions(typedIndex);
        setTimeout(() => {
          setAutocompleteVisible(false);
          setIconsVisible(true);
          setCursorVisible(false);
          setAutocompleteSuggestions([]);
          // 단, 이미 메서드가 선택된 경우 덮어쓰지 않음.
          setTypedMethod(prev => (prev ? prev : "execute()"));
        }, 1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isImageLoaded, typedIndex, classText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isClassTyping =
        autocompleteType === "class" &&
        typedIndex < classText.length &&
        autocompleteSuggestions.length > 0;
      const isMethodTyping =
        autocompleteType === "method" && autocompleteSuggestions.length > 0;

      if (
        (isClassTyping || isMethodTyping) &&
        (e.key === "Tab" || e.key === "Enter")
      ) {
        console.log("isClassTyping", isClassTyping);
        console.log("isMethodTyping", isMethodTyping);
        e.preventDefault();
        if (isClassTyping) {
          const suggestion = autocompleteSuggestions[0];
          setClassText(suggestion);
          setTypedClass(suggestion);
          setTypedIndex(suggestion.length);
          showClassSuggestions(suggestion.length, suggestion);
        } else if (isMethodTyping) {
          const suggestion = autocompleteSuggestions[0];
          setTypedMethod(suggestion);
          setAutocompleteVisible(false);
          setIconsVisible(true);
          setCursorVisible(false);
          setAutocompleteSuggestions([]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typedIndex, classText, autocompleteType, autocompleteSuggestions]);

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
              // "whitespace-pre-wrap break-all" 대신 아래와 같이 수정
              className="// 줄바꿈 관련 설정 (Tailwind 3.2 기준) relative block w-full whitespace-normal break-words rounded-lg p-4 text-center font-code text-2xl text-white-accent sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
            >
              <div className="flex w-full flex-wrap items-center justify-center gap-1">
                <span
                  id="code-class"
                  className={classHighlighted ? "text-[#a3e635]" : ""}
                  // span 내부는 항상 붙여쓰기 되게 하려면
                  style={{ whiteSpace: "nowrap" }}
                >
                  {typedClass}
                </span>
                <span id="code-dot" style={{ whiteSpace: "nowrap" }}>
                  {typedDot}
                </span>
                <span id="code-method" style={{ whiteSpace: "nowrap" }}>
                  {typedMethod}
                </span>
                <span
                  id="code-cursor"
                  ref={codeCursorRef}
                  className="animate-blink"
                  style={{
                    display: cursorVisible ? "inline" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  |
                </span>
              </div>

              <p
                id="hero-text"
                className="mt-4 font-sans text-xs font-light text-gray-200 sm:mt-12 sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
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
                    onClick={() => {
                      if (autocompleteType === "class") {
                        // 클래스 타이핑 단계에서는 클릭한 텍스트(item)로 바로 완성되도록 설정합니다.
                        setClassText(item);
                        setTypedClass(item);
                        setTypedIndex(item.length);
                        showClassSuggestions(item.length, item);
                      } else {
                        // 메서드 타이핑 단계: 클릭한 텍스트가 메서드에 바로 들어갑니다.
                        setTypedMethod(item);
                        setAutocompleteVisible(false);
                        setIconsVisible(true);
                        setCursorVisible(false);
                        setAutocompleteSuggestions([]);
                      }
                    }}
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
