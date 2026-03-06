# Contributing

kiwoom-mcp에 기여해주셔서 감사합니다.

## 기여 방법

1. 이 저장소를 Fork 합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feat/새기능`)
3. 변경 사항을 커밋합니다
4. 브랜치에 Push 합니다 (`git push origin feat/새기능`)
5. Pull Request를 생성합니다

## 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
refactor: 리팩토링
```

## 주의사항

- **API 키나 시크릿 키가 포함된 커밋은 절대 하지 마세요**
- PR 전에 `pnpm run build`가 성공하는지 확인해주세요
- 키움 API의 실제 응답 구조가 변경된 경우, 해당 API의 curl 테스트 결과를 PR에 첨부해주세요

## 새로운 도구 추가 시

1. `src/tools/` 에 새 파일 생성
2. Zod 스키마로 입력 파라미터 정의
3. `src/index.ts`에 도구 등록
4. README의 도구 목록 업데이트
5. 실제 API 호출 테스트 후 PR 제출

## 개발 환경

```bash
pnpm install
pnpm run dev    # 개발 모드
pnpm run build  # 빌드 확인
```
