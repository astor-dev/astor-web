import React, { useState, useCallback, useEffect } from "react";
import IconButton from "~common/components/buttons/icon-button";
import ImageFileInput from "~common/components/inputs/image-file-input";
import Input from "~common/components/inputs/normal-input";
import SelectInput from "~common/components/inputs/select-input";
import type { SeriesEntry } from "~common/types/series.type";
import { generateId } from "~common/utils/id.utils";
import { serviceContainer } from "~modules/service.module";
import {
  SeriesService,
  SERIES_SERVICE,
} from "~modules/services/series.service";

interface SeriesFormProps {
  // 초기 시리즈 데이터 (모든 시리즈 배열) - 필수 값으로 명시
  initialSeries: SeriesEntry[];
}

const SeriesForm: React.FC<SeriesFormProps> = ({ initialSeries }) => {
  const seriesService = serviceContainer.get<SeriesService>(SERIES_SERVICE);

  // 컴포넌트 초기화 상태
  const [isReady, setIsReady] = useState(false);

  // 전체 시리즈 배열 관리
  const [allSeries, setAllSeries] = useState<SeriesEntry["data"][]>(() =>
    initialSeries.map(s => s.data),
  );

  // 신규 시리즈의 기본 상태 생성 함수
  const createNewSeries = useCallback(
    () => ({
      id: generateId(),
      name: "",
      ogImage: "",
    }),
    [],
  );

  // 현재 선택된 시리즈 ID (초기값은 빈 문자열)
  const [selectedId, setSelectedId] = useState<string>("");

  // 현재 편집 중인 시리즈 데이터
  const [currentSeries, setCurrentSeries] =
    useState<SeriesEntry["data"]>(createNewSeries());

  // 신규 시리즈 추가 모드인지 여부
  const [isNewMode, setIsNewMode] = useState<boolean>(true);

  // URL에서 ID 가져오기
  const getIdFromUrl = useCallback(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get("id") || "";
  }, []);

  // URL 업데이트 함수
  const updateUrlWithId = useCallback((id: string) => {
    const url = new URL(window.location.href);

    if (id) {
      url.searchParams.set("id", id);
    } else {
      url.searchParams.delete("id");
    }

    window.history.pushState({ seriesId: id }, "", url.toString());
  }, []);

  // 브라우저 뒤로가기/앞으로가기 이벤트 처리
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const seriesId = event.state?.seriesId || getIdFromUrl();
      setSelectedId(seriesId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [getIdFromUrl]);

  // 초기 데이터 로드 및 설정
  useEffect(() => {
    // 초기 데이터 로딩이 완료되면 실행
    if (initialSeries.length > 0 && !isReady) {
      // URL에서 ID 가져오기
      const urlId = getIdFromUrl();

      // 시리즈 데이터
      const seriesData = initialSeries.map(s => s.data);

      // URL에 ID가 있으면 해당 시리즈 찾기
      if (urlId) {
        const selectedSeries = seriesData.find(s => s.id === urlId);
        if (selectedSeries) {
          setCurrentSeries(selectedSeries);
          setIsNewMode(false);
          setSelectedId(urlId);
        } else {
          // ID가 유효하지 않으면 새 시리즈 모드로
          setCurrentSeries(createNewSeries());
          setIsNewMode(true);
          setSelectedId("");
          updateUrlWithId("");
        }
      } else {
        // URL에 ID가 없으면 새 시리즈 모드
        setCurrentSeries(createNewSeries());
        setIsNewMode(true);
        setSelectedId("");
      }

      // 초기화 완료
      setIsReady(true);
    }
  }, [initialSeries, createNewSeries, updateUrlWithId, getIdFromUrl, isReady]);

  // 시리즈 ID 선택 변경 시 처리 (드롭다운에서 선택했을 때)
  useEffect(() => {
    // 초기화가 완료되기 전에는 처리하지 않음
    if (!isReady) return;

    if (!selectedId) {
      // 새 시리즈 추가 모드
      setCurrentSeries(createNewSeries());
      setIsNewMode(true);
      // 새 시리즈 모드일 때 URL에서 id 파라미터 제거
      updateUrlWithId("");
    } else {
      // 기존 시리즈 편집 모드
      const selected = allSeries.find(s => s.id === selectedId);
      if (selected) {
        setCurrentSeries(selected);
        setIsNewMode(false);
        // 유효한 시리즈 ID인 경우 URL 업데이트
        updateUrlWithId(selectedId);
      } else {
        // 찾을 수 없는 ID인 경우 새 시리즈 모드로
        setCurrentSeries(createNewSeries());
        setIsNewMode(true);
        setSelectedId("");
        // 잘못된 ID인 경우 URL에서 id 파라미터 제거
        updateUrlWithId("");
      }
    }
  }, [selectedId, allSeries, updateUrlWithId, createNewSeries, isReady]);

  // 시리즈 선택 핸들러
  const handleSeriesSelect = useCallback((value: string) => {
    setSelectedId(value);
  }, []);

  // 입력 필드 변경 핸들러
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCurrentSeries(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  // 시리즈 저장 (추가 또는 수정)
  const handleSaveSeries = useCallback(() => {
    // 필수 필드 검증
    if (!currentSeries.name.trim() || !currentSeries.ogImage.trim()) {
      alert("시리즈 이름과 OG 이미지는 필수 입력 항목입니다.");
      return;
    }

    // 기존 시리즈 수정인 경우
    if (!isNewMode) {
      setAllSeries(prev =>
        prev.map(s => (s.id === currentSeries.id ? currentSeries : s)),
      );
    }
    // 새 시리즈 추가인 경우
    else {
      setAllSeries(prev => [...prev, currentSeries]);
      // 추가 후 드롭다운을 새로 추가된 시리즈로 선택
      setSelectedId(currentSeries.id);
      setIsNewMode(false);
    }
  }, [currentSeries, isNewMode]);

  // 시리즈 삭제 핸들러
  const handleDeleteSeries = useCallback(() => {
    if (isNewMode) return;

    if (window.confirm("정말로 이 시리즈를 삭제하시겠습니까?")) {
      setAllSeries(prev => prev.filter(s => s.id !== currentSeries.id));
      setSelectedId(""); // 삭제 후 새 시리즈 추가 모드로 전환
    }
  }, [currentSeries.id, isNewMode]);

  // 전체 시리즈 데이터 저장 (서버에 전송)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 현재 편집 중인 내용이 로컬 상태에 저장되지 않았다면 먼저 저장
      if (currentSeries.name.trim() && currentSeries.ogImage.trim()) {
        handleSaveSeries();
      }

      // 전체 시리즈 데이터를 서버에 저장
      await seriesService.saveAllSeries(allSeries);
      alert("모든 시리즈 데이터가 저장되었습니다.");
    } catch (error) {
      if (error instanceof Error) {
        alert(`시리즈 저장에 실패했습니다: ${error.message}`);
      } else {
        alert("시리즈 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 시리즈 옵션 생성 (드롭다운용)
  const seriesOptions = [
    { value: "", label: "-- 새 시리즈 추가 --" },
    ...allSeries.map(s => ({ value: s.id, label: s.name })),
  ];

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {!isReady ? (
        <div className="rounded-lg border border-skin-line bg-white p-6 text-center">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-skin-line bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold text-black-accent">
              시리즈 관리 (현재 ID: {selectedId || "신규"})
            </h2>

            {/* 시리즈 선택 드롭다운 */}
            <div className="mb-6">
              <SelectInput
                id="series-select"
                label="편집할 시리즈 선택"
                options={seriesOptions}
                value={selectedId}
                onChange={handleSeriesSelect}
              />
            </div>

            {/* 현재 시리즈 정보 편집 영역 */}
            <div className="grid gap-6">
              <Input
                id="id"
                name="id"
                label="시리즈 ID"
                key={`id-${currentSeries.id}`}
                defaultValue={currentSeries.id}
                disabled
              />

              <Input
                id="name"
                name="name"
                label="시리즈 이름"
                required
                key={`name-${currentSeries.id}`}
                defaultValue={currentSeries.name}
                onChange={handleInputChange}
              />

              <div>
                <ImageFileInput
                  id="ogImage"
                  name="ogImage"
                  label="OG 이미지"
                  type="series"
                  required
                  key={`ogImage-${currentSeries.id}`}
                  value={currentSeries.ogImage}
                  setValue={url => {
                    setCurrentSeries(prev => ({ ...prev, ogImage: url || "" }));
                  }}
                />
              </div>

              {/* 현재 시리즈 작업 버튼 */}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveSeries}
                  className="rounded-lg bg-skin-accent px-4 py-2 text-white-base hover:bg-skin-accent/90 active:scale-95"
                >
                  {isNewMode ? "시리즈 추가" : "시리즈 업데이트"}
                </button>

                {!isNewMode && (
                  <button
                    type="button"
                    onClick={handleDeleteSeries}
                    className="border-danger text-danger hover:bg-danger/10 rounded-lg border bg-white px-4 py-2 active:scale-95"
                  >
                    시리즈 삭제
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 전체 시리즈 데이터 저장 영역 */}
          <div className="rounded-lg border border-skin-line bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-black-accent">
              시리즈 데이터 요약
            </h3>

            <div className="mb-4 overflow-auto rounded-lg bg-gray-100 p-4">
              <p className="text-sm">총 {allSeries.length}개의 시리즈</p>
              <pre className="mt-2 max-h-48 overflow-auto text-xs">
                {JSON.stringify(allSeries, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-3">
              <IconButton
                text="취소"
                href="/admin/blog/series"
                variant="secondary"
              />
              <IconButton
                text="모든 시리즈 저장"
                variant="primary"
                type="submit"
              />
            </div>
          </div>
        </>
      )}
    </form>
  );
};

export default SeriesForm;
