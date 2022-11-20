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
        id: "group-0",
        type: "group",
        groupName: "Group 0",
        items: [
          { id: "card-1", type: "card", title: "card-1" },
          { id: "card-2", type: "card", title: "card-2" },
          { id: "card-3", type: "card", title: "card-3" },
        ],
      },
      { id: "card-4", type: "card", title: "card-4" },
      {
        id: "group-1",
        type: "group",
        groupName: "Group 1",
        items: [{ id: "card-9", type: "card", title: "card-9" }],
      },
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
    // const { active, over } = event;
    const { over } = event;
    // if item is dragged to "nowhere"
    if (over === null) return;

    if (activeId !== over.id) {
      console.log("ACTIVE: ", activeId, " OVER: ", over);
      const [columnFrom, groupFrom] = findItem(activeId);
      const [columnTo, groupTo] = findItem(over.id);

      const newBoardData = boardData;
      // if we move inside one column, do the move (otherwise the handleDragOver will handle it)
      if (columnFrom === columnTo) {
        // if active item source is not a group
        if (groupFrom === undefined) {
          let destinationColumn = newBoardData[columnTo];
          const oldItem = destinationColumn.find((i) => i.id === activeId);
          const oldIndex = destinationColumn.indexOf(oldItem);

          // and active item destination (over's container) is also not a group
          if (groupTo === undefined) {
            console.log("BASIC MOVE");
            // do a basic replacement
            const newItem = destinationColumn.find((i) => i.id === over.id);
            const newIndex = destinationColumn.indexOf(newItem);
            newBoardData[columnTo] = arrayMove(
              destinationColumn,
              oldIndex,
              newIndex
            );
          }
          // otherwise put active item in the appropriate group
          else {
            console.log("PUTTING ITEM INTO GROUP FROM OUTSIDE");
            const group = newBoardData[columnTo][groupTo];
            const newItem = group.items.find((i) => i.id === over.id);
            const newIndex = group.items.indexOf(newItem);
            // add active item to group
            group.items.splice(newIndex, 0, oldItem);
            // remove active item from its old place
            newBoardData[columnFrom].splice(oldIndex, 1);
          }
          // if active item source is a group
        } else {
          const sourceGroup = newBoardData[columnFrom][groupFrom];
          const oldItem = sourceGroup.items.find((i) => i.id === activeId);
          const oldIndex = sourceGroup.items.indexOf(oldItem);

          // and active item destination is also a group
          if (groupTo !== undefined) {
            // for later: if type of source (active) item is group, don't move inside, but merge with destination group

            const destinationGroup = newBoardData[columnTo][groupTo];
            const newItem = destinationGroup.items.find(
              (i) => i.id === over.id
            );
            const newIndex = destinationGroup.items.indexOf(newItem);

            // source and destination are the same group
            if (groupFrom === groupTo) {
              console.log("MOVE ITEM INSIDE GROUP");
              destinationGroup.items = arrayMove(
                destinationGroup.items,
                oldIndex,
                newIndex
              );
            } else {
              console.log("MOVE ITEM BETWEEN DIFFERENT GROUPS");
              destinationGroup.items.splice(newIndex, 0, oldItem);
              sourceGroup.items.splice(oldIndex, 1);
            }
          }
          // but active item destination is not a group
          else {
            console.log("MOVE ITEM OUTSIDE OF ITS GROUP");
            const newItem = newBoardData[columnTo].find(
              (i) => i.id === over.id
            );
            const newIndex = newBoardData[columnTo].indexOf(newItem);
            newBoardData[columnTo].splice(newIndex, 0, oldItem);
            sourceGroup.items.splice(oldIndex, 1);
          }

          // remove empty group (if there is one)
          const emptyGroup = newBoardData[columnFrom].find(
            (i) => i.type === "group" && i.items.length === 0
          );
          if (emptyGroup) {
            const emptyGroupIndex =
              newBoardData[columnFrom].indexOf(emptyGroup);
            newBoardData[columnFrom].splice(emptyGroupIndex, 1);
          }
        }
      }
      console.log("NEW BOARD DATA: ", newBoardData);
      setBoardData(newBoardData);
      setActiveId(undefined);
    }
  }

  /**
   * Helper function for handleDragEnd to find place of an item inside the board data.
   *
   * @param {string} itemId id of the item we are looking for.
   * @return {Array[2]} An array containing [colunIndex, groupIndex]. If a group or column wasn't found, returns undefined values (if only columnIndex has a value, the item is not in a group).
   * @see handleDragEnd, boardData
   */
  function findItem(itemId) {
    // find which column contains active item's id
    let column; // index of column
    let group; // index of group inside the column
    for (let columnIndex = 0; columnIndex < boardData.length; columnIndex++) {
      if (boardData[columnIndex].find((item) => item.id === itemId)) {
        column = columnIndex;
        break;
      }
      // if it wasn't on the first level of the column, it could be inside a group
      for (
        let itemIndex = 0;
        itemIndex < boardData[columnIndex].length;
        itemIndex++
      ) {
        if (
          boardData[columnIndex][itemIndex].type === "group" &&
          boardData[columnIndex][itemIndex].items.find(
            (groupedItem) => groupedItem.id === itemId
          )
        ) {
          // if active item is found inside current group
          // save group index
          column = columnIndex;
          group = itemIndex;
          break;
        }
      }
      // if active item was found in a group, don't look for it in other columns
      if (group) break;
    }
    console.log("findItem results for ", itemId, " are: ", [column, group]);
    return [column, group];
  }

  function handleDragOver(event) {
    const { active, over } = event;

    // if current columnId different than destination columnId, move active item to new column array (would be nicer to store everything in one column and just modify a columnId prop)
    // if (active.id.split(0, 1) !== over.id.split(0, 1)) {
    // }
  }
};
