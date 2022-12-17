import { GetServerSideProps } from "next";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useForm } from "react-hook-form";
import { fetcher, postFetcher } from "../helper/Helper";
import useSWR from "swr";
import _ from "lodash";
import PostOffice from "components/PostOffice";
import SnowFlake from "components/canvas/SnowFlake";
import Charactor from "components/canvas/Charactor";
import LetterList from "components/LetterList";
import SendLetterForm from "components/SendLetterForm";
import Fireplace from "components/canvas/Fireplace";
import { getSession, signOut } from "next-auth/react";
import CreateLetterModal from "components/modals/CreateLetterModal";
import ShowLetterModal from "components/modals/ShowLetterModal";
import { useRouter } from "next/router";

type Props = {
  letterCount: any;
  letters: any;
  userName: string;
  userList?: string[];
};

export default function Index(props: Props) {
  const { letterCount, letters, userName, userList } = props;
  const router = useRouter();

  const [showBubble, setShowBubble] = useState(false);
  // const testSound = new Audio('sound/test.mp3');

  const { data } = useSWR(`/api/letters`, fetcher);

  return (
    <div className="relative">
      <div className="absolute right-40 bottom-[200px] w-1/5 h-1/5">
        <button onClick={() => setShowBubble(true)}>
          <img src="/images/gami.png" className="w-full h-full" />
        </button>
      </div>
      <div className="hidden">
        <audio id="bgm" loop controls autoPlay>
          <source src="sounds/jingle_bells.mp3" />
        </audio>
      </div>
      <img
        src="/images/fireplace.png"
        className="absolute bottom-40 left-[50%] translate-x-[-50%] w-fit h-2/3"
      />
      <Fireplace letters={letters} />
      <div className="absolute top-12 left-[50%] translate-x-[-50%]">
        {showBubble && (
          <>
            <button className="btn" onClick={() => router.push("/rank")}>
              랭킹 보기
            </button>
            <CreateLetterModal userList={userList} />
            <ShowLetterModal letters={letters} />
            <button onClick={() => signOut()}>로그아웃</button>
          </>
        )}

        <div className="flex flex-col py-4 px-9 top-0 border-4 border-dashed border-green-600 rounded bg-red-600 z-10">
          <h1 className="text-white text-center mb-4">{userName}의 벽난로</h1>
          <h2 className="text-white text-center">
            {letterCount[userName]?.count ?? 0}개의 편지
          </h2>
        </div>
      </div>

      <img src="/images/house_background.png" className="h-screen w-screen" />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const baseUrl = `http://${ctx.req.headers.host}`;
  const { user } = session;
  const { name } = user;
  const userName = name ?? "히히"; //로그인 도입 후 userName으로
  const groupedLetter = await fetch(baseUrl + "/api/letter-count").then((res) =>
    res.json()
  );
  const letterCount = _.keyBy(groupedLetter, "_id");
  const letters = userName
    ? await fetch(baseUrl + "/api/letters" + `?name=${userName}`).then((res) =>
        res.json()
      )
    : [];
  const users = userName
    ? await fetch(baseUrl + "/api/users" + `?name=${userName}`).then((res) =>
        res.json()
      )
    : [];
  const userList = _.map(users, "name");

  return {
    props: { letterCount, letters, userName, userList },
  };
};
