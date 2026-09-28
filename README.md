# SquadFlow

축구 및 풋살 아마추어 팀을 위한 올인원 운영 관리 서비스입니다. 경기 일정부터 참석 투표, 출석, 전술, 경기 기록, 선수 통계, 회비까지 흩어지기 쉬운 팀 운영 업무를 하나의 흐름으로 연결합니다.

**Live Demo:** [team98-urfk.vercel.app](https://team98-urfk.vercel.app/)

## Problem

아마추어 팀 운영은 보통 메신저, 스프레드시트, 별도 기록 앱을 오가며 진행됩니다. 이 과정에서 참석 인원, 전술, 경기 기록, 회비 내역이 분리되고 운영자의 반복 업무가 늘어납니다.

SquadFlow는 경기 전, 경기 당일, 경기 후의 정보를 연결해 팀원이 같은 상태를 확인하고 운영자가 한곳에서 관리할 수 있도록 설계했습니다.

## Key Features

### Team and member management

- 이메일 기반 회원가입, 로그인, 비밀번호 재설정
- 팀 생성 및 초대 코드 기반 팀 참가
- 팀원, 선수 프로필, 역할, 포지션, 등번호 관리
- 시즌 생성 및 활성 시즌 관리

### Match operations

- 캘린더와 목록 기반 경기 일정 관리
- 참석, 미정, 불참 투표 및 마감 상태 관리
- 출석 체크와 자체전 팀 배정
- 쿼터별 전술 보드와 포메이션, 전담 키커 설정
- 경기 결과, 선수 기록, MVP 투표 관리

### Team insights and finance

- 개인 및 팀 통계, 선수 순위, 상대 전적
- 회비 유형별 납부 현황과 개인별 회비 설정
- 입출금 내역, 벌금 규칙, 자동 및 수동 벌금 부과
- 대시보드, 공지 게시판, 알림, 할 일 모아보기

## Core Flow

```text
팀 생성 또는 참가
  -> 선수 등록 및 시즌 설정
  -> 경기 생성
  -> 참석 투표 및 출석 확정
  -> 전술/포메이션 배치
  -> 경기 기록 및 MVP 입력
  -> 통계, 회비, 벌금 현황 확인
```

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Pretendard |
| Backend | Supabase Auth, Database, Realtime |
| Forms | React Hook Form, Zod |
| Client state | Zustand |
| Interaction | dnd-kit |
| UI | Lucide React, Radix UI |

## Architecture

```text
app/           Route composition and page metadata
components/    Screen and feature-focused UI components
hooks/         UI state and feature orchestration
lib/           Supabase repositories and domain utilities
types/         Shared domain types
```

Feature modules are separated by domain such as `matches`, `tactics`, `finance`, `players`, and `stats`. UI components call feature hooks, while data access is isolated in Supabase repository modules under `lib/`.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A Supabase project with the required tables, RLS policies, and RPC functions configured

### Install

```bash
npm install
```

### Environment variables

Create `.env.local` in the project root.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Portfolio Checklist

Before sharing the project, add the following to this README.

- Test account or a short demo video
- Screenshots of landing, dashboard, match detail, tactics board, and finance screens
- Database schema or migration guide for reproducing the Supabase setup

## Author

Song Kijun
