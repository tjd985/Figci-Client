import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";
import ToastPopup from "../shared/Toast";

import getPages from "../../../services/pages";

import useProjectVersionStore from "../../../store/projectVersion";
import usePageListStore from "../../../store/projectPage";
import usePageStatusStore from "../../../store/projectInit";

function ProjectVersion() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [projectVersion, setProjectVersion] = useState({});

  const navigate = useNavigate();

  const { status, setStatus, clearProject } = usePageStatusStore();
  const { allDates, byDates } = useProjectVersionStore();
  const { setPages } = usePageListStore();

  const handleChange = ev => {
    setProjectVersion({
      ...projectVersion,
      [ev.currentTarget.className]: ev.target.value,
    });
  };

  const handleClick = async ev => {
    ev.preventDefault();

    if (ev.target.classList.contains("prev")) {
      clearProject();

      navigate("/new");

      return;
    }

    const { beforeVersion, afterVersion } = projectVersion;

    setStatus(projectVersion);

    setIsLoaded(true);

    const pageList = await getPages(
      status.projectKey,
      beforeVersion,
      afterVersion,
    );

    if (pageList.result === "error") {
      setIsLoaded(false);

      setToastMessage(pageList.message);
      setToast(true);

      navigate("/new");
    }

    setPages(pageList.content);

    setIsLoaded(false);

    navigate("/page");
  };

  const createOption = versions => {
    const optionList = [];

    for (const versionId in versions) {
      const versionTitle = versions[versionId].label;

      optionList.push(
        <option value={versionId} key={versionId}>
          {versionTitle}
        </option>,
      );
    }

    return optionList;
  };

  const beforeVersionForm = {
    label: "이전 버전",
    description: "지정한 버전 명이 없으면 시간으로 보여요!",
    selects: [
      {
        className: "beforeDate",
        handleChange,
        placeholder: "버전 선택",
        options: allDates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        )),
      },
      {
        className: "beforeVersion",
        handleChange,
        placeholder: "날짜 선택",
        options:
          projectVersion.beforeDate &&
          createOption(byDates[projectVersion.beforeDate]),
      },
    ],
  };

  const afterVersionForm = {
    label: "이후 버전",
    description: "지정한 버전 명이 없으면 시간으로 보여요!",
    selects: [
      {
        className: "afterDate",
        handleChange,
        placeholder: "날짜 선택",
        options: allDates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        )),
      },
      {
        className: "afterVersion",
        handleChange,
        placeholder: "버전 선택",
        options:
          projectVersion.afterDate &&
          createOption(byDates[projectVersion.afterDate]),
      },
    ],
  };

  const contents = {
    title: {
      step: "02",
      text: "비교할 해당 피그마 파일의\n이전 / 최신 버전을 입력해 주세요",
    },
    buttons: [
      {
        text: "이전",
        usingCase: "line",
        handleClick,
        className: "prev",
      },
      {
        text: "다음",
        usingCase: "solid",
        handleClick,
        className: "next",
      },
    ],
  };

  return (
    <>
      {isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
      <ContentsWrapper>
        <Title title={contents.title} />
        <HorizontalAlign>
          <Select selectInfo={beforeVersionForm} />
          <Select selectInfo={afterVersionForm} />
        </HorizontalAlign>
      </ContentsWrapper>
      <BottomNavigator buttons={contents.buttons} />
      {toast && <ToastPopup setToast={setToast} message={toastMessage} />}
    </>
  );
}

const ContentsWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 64px;
`;

const HorizontalAlign = styled.form`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
`;

export default ProjectVersion;