import { create } from "zustand";

const pageStore = set => {
  return {
    byPageIds: {},
    allPageIds: [],
    setPages: pageList => {
      const pageIds = [];

      pageList.forEach(item => {
        const [pageId, pageName] = Object.entries(item)[0];

        pageIds.push(pageId);

        set(state => {
          state.byPageIds = {
            ...state.byPageIds,
            [pageId]: pageName,
          };

          return state;
        });
      });

      set(state => {
        state.allPageIds = pageIds;

        return state;
      });
    },
  };
};

const usePageListStore = create(pageStore);

export default usePageListStore;
