# Changelog

## [1.0.0] - 2026-03-06

### Added
- 현재가 조회 (`get_stock_price`) - ka10001
- 호가 조회 (`get_orderbook`) - ka10004
- 일봉 차트 조회 (`get_daily_chart`) - ka10081
- 투자자별 매매동향 (`get_investor_trend`) - ka10066
- 계좌평가현황 (`get_account_balance`) - kt00004
- 예수금 조회 (`get_deposit`) - kt00001
- 미체결 주문 조회 (`get_unfilled_orders`) - ka10075
- 체결 내역 조회 (`get_filled_orders`) - ka10076
- OAuth2 토큰 자동 관리 (발급, 캐싱, 만료 1시간 전 자동 갱신)
- 재시도 로직 (최대 3회, 지수 백오프)
- 숫자 포맷팅 (앞자리 0 제거, 천 단위 콤마)

### Known Limitations
- `get_investor_trend`: 키움 API 제약으로 당일 거래량 상위 100종목만 조회 가능
- `get_orderbook`: 장 마감 후에는 빈 데이터 반환
- 조회 전용 (주문 기능 미포함)
