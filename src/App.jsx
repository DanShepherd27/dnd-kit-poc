import React, { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "./components/Column";
import { Board } from "./components/Board";
import { DragOverlay } from "@dnd-kit/core";
import * as S from "./components/Card.styled";
// import { Droppable } from "./components/Droppable";

export const App = () => {
  const [boardData, setBoardData] = useState([
    [
      { id: "card-0", type: "card", title: "card-0" },
      {
        id: "group-1",
        type: "group",
        groupName: "Group 0",
        items: [
          { id: "card-1", type: "card", title: "card-1" },
          { id: "card-2", type: "card", title: "card-2" },
          { id: "card-3", type: "card", title: "card-3" },
        ],
      },
      { id: "card-4", type: "card", title: "card-4" },
      { id: "card-5", type: "card", title: "card-5" },
    ],
    [
      { id: "card-6", type: "card", title: "card-6" },
      { id: "card-7", type: "card", title: "card-7" },
    ],
    [],
    [{ id: "card-8", type: "card", title: "card-8" }],
  ]);

  const [activeId, setActiveId] = useState();

  // CONSOLE LOG!
  console.log(boardData);

  return (
    <Board
      handleDragEnd={handleDragEnd}
      handleDragOver={handleDragOver}
      handleDragStart={handleDragStart}
    >
      {boardData.map((column, index) => (
        <Column id={"column-" + index} items={column} key={index} />
      ))}
      <DragOverlay>{activeId ? <S.Card id={activeId} /> : null}</DragOverlay>
    </Board>
  );

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const newBoardData = boardData;
      let columnToChange = newBoardData[newBoardData.indexOf(active.id)];
      columnToChange = arrayMove(
        columnToChange,
        columnToChange.indexOf(active.id),
        columnToChange.indexOf(over.id)
      );

      setBoardData(newBoardData);
      // setBoardData((cards) => {
      //   const oldIndex = cards[0].indexOf(active.id);
      //   const newIndex = cards[0].indexOf(over.id);
      //   // return arrayMove(cards[0], oldIndex, newIndex);
      //   return cards[0];
      // });
    }

    console.log("ACTIVE: ", active, " OVER: ", over);
  }

  function handleDragOver(event) {
    const { active, over } = event;

    // if current columnId different than destination columnId, move active item to new column array (would be nicer to store everything in one column and just modify a columnId prop)
    // if (active.id.split(0, 1) !== over.id.split(0, 1)) {
    // }
  }
};
