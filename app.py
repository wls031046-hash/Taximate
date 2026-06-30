"""Taximate — 택시 합승 매칭 (Streamlit 프로토타입)"""

from __future__ import annotations

import uuid
from datetime import date, datetime, time
from typing import Literal

import streamlit as st

RideMode = Literal["pickup", "together"]
RideStatus = Literal["open", "full"]

CURRENT_USER = {"id": "u-me", "name": "박유진", "rating": 4.8}

MODE_LABEL = {
    "pickup": "경유 픽업",
    "together": "동반 출발",
}

MODE_DESC = {
    "pickup": "가는 길에 있는 사람을 도중에 태우기",
    "together": "출발지에서 함께 출발하기",
}

POPULAR_LOCATIONS = [
    "강남역",
    "홍대입구",
    "잠실역",
    "서울역",
    "신촌역",
    "인천공항",
    "김포공항",
    "수원역",
    "판교역",
]

POPULAR_ROUTES = [
    ("강남역", "인천공항"),
    ("홍대입구", "김포공항"),
    ("잠실역", "수원역"),
]


def _at(hour: int, minute: int = 0) -> datetime:
    today = date.today()
    return datetime.combine(today, time(hour, minute))


def initial_rides() -> list[dict]:
    return [
        {
            "id": "r1",
            "host_id": "u1",
            "host_name": "이지은",
            "from": "강남역",
            "to": "인천공항",
            "departure_at": _at(14, 30),
            "max_seats": 4,
            "mode": "pickup",
            "passengers": [{"user_id": "u2", "name": "박준호"}],
            "status": "open",
        },
        {
            "id": "r2",
            "host_id": "u3",
            "host_name": "최서연",
            "from": "홍대입구",
            "to": "김포공항",
            "departure_at": _at(16, 0),
            "max_seats": 3,
            "mode": "together",
            "passengers": [],
            "status": "open",
        },
        {
            "id": "r3",
            "host_id": "u4",
            "host_name": "정우진",
            "from": "잠실역",
            "to": "수원역",
            "departure_at": _at(18, 15),
            "max_seats": 3,
            "mode": "pickup",
            "passengers": [
                {"user_id": "u5", "name": "한소희"},
                {"user_id": "u6", "name": "오태양"},
            ],
            "status": "full",
        },
        {
            "id": "r4",
            "host_id": "u7",
            "host_name": "윤하늘",
            "from": "서울역",
            "to": "판교역",
            "departure_at": _at(8, 45),
            "max_seats": 2,
            "mode": "together",
            "passengers": [{"user_id": "u8", "name": "강다은"}],
            "status": "full",
        },
        {
            "id": "r5",
            "host_id": "u9",
            "host_name": "송민재",
            "from": "신촌역",
            "to": "강남역",
            "departure_at": _at(22, 0),
            "max_seats": 4,
            "mode": "pickup",
            "passengers": [],
            "status": "open",
        },
    ]


def current_count(ride: dict) -> int:
    return 1 + len(ride["passengers"])


def is_joined(ride: dict) -> bool:
    uid = CURRENT_USER["id"]
    if ride["host_id"] == uid:
        return True
    return any(p["user_id"] == uid for p in ride["passengers"])


def can_join(ride: dict) -> bool:
    return (
        ride["status"] == "open"
        and not is_joined(ride)
        and current_count(ride) < ride["max_seats"]
    )


def join_ride(ride_id: str) -> None:
    for ride in st.session_state.rides:
        if ride["id"] != ride_id:
            continue
        if not can_join(ride):
            return
        ride["passengers"].append(
            {"user_id": CURRENT_USER["id"], "name": CURRENT_USER["name"]}
        )
        if current_count(ride) >= ride["max_seats"]:
            ride["status"] = "full"
        return


def known_locations(rides: list[dict]) -> list[str]:
    locs = set(POPULAR_LOCATIONS)
    for ride in rides:
        locs.add(ride["from"])
        locs.add(ride["to"])
    return sorted(locs)


def location_suggestions(query: str, rides: list[dict], limit: int = 6) -> list[str]:
    q = query.strip().lower()
    if not q:
        return []
    matches = [loc for loc in known_locations(rides) if q in loc.lower()]
    exact = [loc for loc in matches if loc.lower() == q]
    partial = [loc for loc in matches if loc.lower() != q]
    return (exact + partial)[:limit]


def destination_suggestions(from_loc: str, rides: list[dict]) -> list[str]:
    f = from_loc.strip()
    if not f:
        return []
    dests: set[str] = set()
    fl = f.lower()
    for ride in rides:
        if fl in ride["from"].lower() or fl in ride["to"].lower():
            dests.add(ride["to"])
            if ride["from"].lower() != fl:
                dests.add(ride["from"])
    for pf, pt in POPULAR_ROUTES:
        if fl in pf.lower() or pf.lower() in fl:
            dests.add(pt)
    dests.discard(f)
    return sorted(dests)[:8]


def render_location_picker(
    label: str,
    state_key: str,
    placeholder: str,
    rides: list[dict],
    *,
    exclude: str = "",
) -> str:
    if state_key not in st.session_state:
        st.session_state[state_key] = ""

    value = st.text_input(
        label,
        value=st.session_state[state_key],
        placeholder=placeholder,
        key=f"input_{state_key}",
    )
    st.session_state[state_key] = value

    suggestions = location_suggestions(value, rides)
    if exclude.strip():
        suggestions = [s for s in suggestions if s.strip().lower() != exclude.strip().lower()]

    if value.strip() and suggestions:
        exact = any(s.lower() == value.strip().lower() for s in suggestions)
        if not exact or len(suggestions) > 1:
            st.caption("📍 선택지")
            cols = st.columns(min(len(suggestions), 4))
            for i, loc in enumerate(suggestions):
                if cols[i % len(cols)].button(
                    loc,
                    key=f"pick_{state_key}_{loc}",
                    use_container_width=True,
                ):
                    st.session_state[state_key] = loc
                    st.rerun()

    return st.session_state[state_key]


def filter_rides(
    rides: list[dict],
    from_query: str,
    to_query: str,
    mode_filter: str,
) -> list[dict]:
    f = from_query.strip().lower()
    t = to_query.strip().lower()
    result = []
    for ride in rides:
        if mode_filter != "전체" and MODE_LABEL[ride["mode"]] != mode_filter:
            continue
        if not f and not t:
            result.append(ride)
            continue
        from_ok = f in ride["from"].lower() if f else False
        to_ok = t in ride["to"].lower() if t else False
        if from_ok or to_ok:
            result.append(ride)
    return sorted(result, key=lambda r: r["departure_at"])


def fmt_departure(dt: datetime) -> str:
    today = date.today()
    tomorrow = date.fromordinal(today.toordinal() + 1)
    d = dt.date()
    if d == today:
        day = "오늘"
    elif d == tomorrow:
        day = "내일"
    else:
        day = f"{d.month}월 {d.day}일"
    h, m = dt.hour, dt.minute
    ampm = "오전" if h < 12 else "오후"
    h12 = h % 12 or 12
    return f"{day} {ampm} {h12}:{m:02d}"


def inject_css() -> None:
    st.markdown(
        """
        <style>
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        html, body, [class*="css"] { font-family: Pretendard, sans-serif; }
        .block-container { padding-top: 1.5rem; max-width: 720px; }
        .taximate-title { font-size: 1.6rem; font-weight: 800; letter-spacing: 0.05em; }
        .taximate-sub { color: #78716c; font-size: 0.9rem; margin-top: 0.2rem; }
        div[data-testid="stMetric"] { background: #fafaf9; border-radius: 12px; padding: 8px; }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_ride_card(ride: dict) -> None:
    count = current_count(ride)
    status = "마감" if ride["status"] == "full" else "모집 중"
    mode = MODE_LABEL[ride["mode"]]
    joined = is_joined(ride)
    is_host = ride["host_id"] == CURRENT_USER["id"]

    with st.container(border=True):
        c1, c2 = st.columns([3, 1])
        with c1:
            st.markdown(f"**{ride['from']}** → {ride['to']}")
            st.caption(f"🕐 {fmt_departure(ride['departure_at'])} · 👥 {count}/{ride['max_seats']}명 · 호스트 {ride['host_name']}")
        with c2:
            st.markdown(f"`{status}`")
            st.markdown(f"`{mode}`")

        if is_host:
            st.info("내가 등록한 합승")
        elif joined:
            st.success("참여 완료")
        elif can_join(ride):
            if st.button("참여하기", key=f"join_{ride['id']}", type="primary", use_container_width=True):
                join_ride(ride["id"])
                st.rerun()
        else:
            st.button("마감", key=f"closed_{ride['id']}", disabled=True, use_container_width=True)


def page_browse() -> None:
    st.subheader("합승 찾기")
    st.caption("출발지가 같거나, 도착지가 같으면 합승을 찾아드려요.")

    with st.container(border=True):
        st.markdown("**내가 가는 경로**")
        fc1, fc2 = st.columns(2)
        with fc1:
            from_query = render_location_picker(
                "출발지",
                "my_from",
                "예: 강남역, 홍대입구",
                st.session_state.rides,
            )
        with fc2:
            to_query = render_location_picker(
                "도착지",
                "my_to",
                "예: 인천공항, 수원역",
                st.session_state.rides,
                exclude=from_query,
            )

        if (
            from_query.strip()
            and to_query.strip()
            and from_query.strip().lower() == to_query.strip().lower()
        ):
            st.warning("출발지와 도착지가 같아요. 아래에서 도착지를 선택해 주세요.")
            dests = destination_suggestions(from_query, st.session_state.rides)
            if dests:
                st.caption("🎯 추천 도착지")
                dest_cols = st.columns(min(len(dests), 4))
                for i, dest in enumerate(dests):
                    if dest_cols[i % len(dest_cols)].button(
                        dest,
                        key=f"dest_pick_{dest}",
                        use_container_width=True,
                    ):
                        st.session_state.my_to = dest
                        st.rerun()

        st.caption("인기 경로")
        popular_cols = st.columns(3)
        for i, (f, t) in enumerate(POPULAR_ROUTES):
            if popular_cols[i].button(f"{f} → {t}", key=f"route_{i}", use_container_width=True):
                st.session_state.my_from = f
                st.session_state.my_to = t
                st.rerun()

        mode_filter = st.radio(
            "합승 방식",
            ["전체", "경유 픽업", "동반 출발"],
            horizontal=True,
        )

    filtered = filter_rides(
        st.session_state.rides,
        from_query,
        to_query,
        mode_filter,
    )

    if from_query.strip() or to_query.strip():
        route_label = f"**{from_query or '어디서든'}** → **{to_query or '어디든'}**"
        st.caption(f"{route_label} · **{len(filtered)}건**의 합승")
    else:
        st.caption(f"전체 **{len(filtered)}건**의 합승 · 출발지·도착지 각각 맞는 합승을 보여줘요")

    if not filtered:
        st.warning("조건에 맞는 합승이 없어요. '합승 만들기'에서 직접 등록해 보세요.")
        return

    for ride in filtered:
        render_ride_card(ride)


def page_create() -> None:
    st.subheader("합승 등록")
    st.caption("같은 방향으로 가는 승객을 모집해 보세요.")

    from_loc = render_location_picker(
        "출발 위치 *",
        "create_from",
        "강남역 2번 출구",
        st.session_state.rides,
    )
    to_loc = render_location_picker(
        "도착 위치 *",
        "create_to",
        "인천공항 T1",
        st.session_state.rides,
        exclude=from_loc,
    )

    if (
        from_loc.strip()
        and to_loc.strip()
        and from_loc.strip().lower() == to_loc.strip().lower()
    ):
        st.warning("출발지와 도착지가 같아요. 아래에서 도착지를 선택해 주세요.")
        dests = destination_suggestions(from_loc, st.session_state.rides)
        if dests:
            dest_cols = st.columns(min(len(dests), 4))
            for i, dest in enumerate(dests):
                if dest_cols[i % len(dest_cols)].button(
                    dest,
                    key=f"create_dest_{dest}",
                    use_container_width=True,
                ):
                    st.session_state.create_to = dest
                    st.rerun()

    with st.form("create_ride", clear_on_submit=True):
        dep_date = st.date_input("출발 날짜 *", value=date.today())
        dep_time = st.time_input("출발 시간 *", value=time(14, 0))

        max_seats = st.selectbox(
            "모집 인원 (본인 포함) *",
            options=[2, 3, 4],
            format_func=lambda n: f"{n}명 (본인 + {n - 1}명)",
        )

        mode = st.radio(
            "합승 방식 *",
            options=["pickup", "together"],
            format_func=lambda m: f"{MODE_LABEL[m]} — {MODE_DESC[m]}",
        )

        submitted = st.form_submit_button("합승 등록하기", type="primary", use_container_width=True)

        if submitted:
            if not from_loc.strip() or not to_loc.strip():
                st.error("출발 위치와 도착 위치를 입력해 주세요.")
                return
            if from_loc.strip().lower() == to_loc.strip().lower():
                st.error("출발지와 도착지는 달라야 해요.")
                return
            departure = datetime.combine(dep_date, dep_time)
            if departure <= datetime.now():
                st.error("출발 시간은 현재 이후여야 해요.")
                return

            st.session_state.rides.insert(
                0,
                {
                    "id": str(uuid.uuid4())[:8],
                    "host_id": CURRENT_USER["id"],
                    "host_name": CURRENT_USER["name"],
                    "from": from_loc.strip(),
                    "to": to_loc.strip(),
                    "departure_at": departure,
                    "max_seats": max_seats,
                    "mode": mode,
                    "passengers": [],
                    "status": "open",
                },
            )
            st.session_state.page = "합승 찾기"
            st.session_state.create_from = ""
            st.session_state.create_to = ""
            st.success("합승이 등록되었어요!")
            st.rerun()


def page_my() -> None:
    st.subheader("내 합승")
    mine = [r for r in st.session_state.rides if is_joined(r)]
    mine = sorted(mine, key=lambda r: r["departure_at"])

    if not mine:
        st.info("아직 참여하거나 등록한 합승이 없어요.")
        return

    for ride in mine:
        render_ride_card(ride)


def main() -> None:
    st.set_page_config(
        page_title="Taximate",
        page_icon="🚕",
        layout="centered",
        initial_sidebar_state="collapsed",
    )
    inject_css()

    if "rides" not in st.session_state:
        st.session_state.rides = initial_rides()
    if "page" not in st.session_state:
        st.session_state.page = "합승 찾기"

    st.markdown('<div class="taximate-title">🚕 TAXIMATE</div>', unsafe_allow_html=True)
    st.markdown('<div class="taximate-sub">같은 방향, 함께 타요</div>', unsafe_allow_html=True)

    user = CURRENT_USER
    st.caption(f"👤 {user['name']} · ★ {user['rating']}")

    tab = st.radio(
        "메뉴",
        ["합승 찾기", "합승 만들기", "내 합승"],
        horizontal=True,
        label_visibility="collapsed",
        index=["합승 찾기", "합승 만들기", "내 합승"].index(st.session_state.page),
    )
    st.session_state.page = tab

    st.divider()

    if tab == "합승 찾기":
        page_browse()
    elif tab == "합승 만들기":
        page_create()
    else:
        page_my()

    st.divider()
    st.caption(
        "이 도구는 프로토타입이며 실제 택시 매칭 서비스가 아닙니다. "
        "실제 이용 시 안전에 유의하세요."
    )


if __name__ == "__main__":
    main()
