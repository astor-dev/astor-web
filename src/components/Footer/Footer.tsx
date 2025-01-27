// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-skin-line bg-skin-card">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 메인 콘텐츠 */}
        <div className="lg:grid-cols-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* 저작권 정보 */}
          <div className="flex flex-col space-y-4">
            <div className="text-xl font-bold text-skin-accent">astoir</div>
            <p className="text-sm text-skin-base/70">
              © {new Date().getFullYear()} astoir.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* 법적 링크 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-skin-base">
              법적 고지
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/privacy"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  이용약관
                </a>
              </li>
              <li>
                <a
                  href="/license"
                  className="text-skin-base/70 hover:text-skin-accent"
                >
                  라이선스
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-skin-base">
              연락처
            </h3>
            <ul className="space-y-2 text-sm text-skin-base/70">
              <li>contact@astoir.com</li>
              <li>서울특별시 강남구</li>
              <li>사업자등록번호: 123-45-67890</li>
            </ul>
          </div>

          {/* SNS 링크 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-skin-base">
              팔로우
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-skin-base/70 hover:text-skin-accent">
                GitHub
              </a>
              <a href="#" className="text-skin-base/70 hover:text-skin-accent">
                RSS
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
