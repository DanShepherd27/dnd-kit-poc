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
    [
      {
        id: "group-2",
        type: "group",
        groupName: "Group 2",

        items: [
          { id: "card-10", type: "card", title: "card-10" },
          {
            id: "group-3",
            type: "group",
            groupName: "Group 3",
            items: [
              { id: "card-10", type: "card", title: "card-10" },
              { id: "card-11", type: "card", title: "card-11" },
            ],
          },
          {
            id: "group-4",
            type: "group",
            groupName: "Group 4",
            items: [{ id: "card-12", type: "card", title: "card-12" }],
          },
        ],
      },
    ],
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
        // if active item's container is not a group
        if (groupFrom === undefined) {
          let sourceContainer = newBoardData[columnFrom];
          const oldItem = sourceContainer.find((i) => i.id === activeId);
          const oldIndex = sourceContainer.indexOf(oldItem);

          // and destination container (over's container) is also not a group
          if (groupTo === undefined) {
            const overItem = sourceContainer.find((i) => i.id === over.id);
            const overIndex = sourceContainer.indexOf(overItem);

            // merge group with the other group
            if (overItem.type === "group") {
              console.log("MERGING GROUPS (group dragged over grouped item)");
              overItem.items = [...overItem.items, ...oldItem.items];
              sourceContainer.splice(oldIndex, 1);
            }
            // do a basic replacement
            else {
              console.log("BASIC MOVE");
              newBoardData[columnTo] = arrayMove(
                sourceContainer,
                oldIndex,
                overIndex
              );
            }
          }
          // otherwise (a.k.a if destination container is a group) put active item in the appropriate group
          else {
            console.log("PUTTING ITEM INTO GROUP FROM OUTSIDE");
            let destinationContainer = newBoardData[columnTo][groupTo].items;
            let overItem = destinationContainer.find((i) => i.id === over.id);
            const overIndex = destinationContainer.indexOf(overItem);

            // if type of active item type is group, don't move inside, but merge with destination group
            if (oldItem.type === "group") {
              console.log("MERGING GROUPS (group dragged over grouped item)");
              newBoardData[columnTo][groupTo].items = [
                ...destinationContainer,
                ...oldItem.items,
              ];
            }
            // otherwise add active item to group
            else {
              destinationContainer.splice(overIndex, 0, oldItem);
            }
            // remove active item from its old place
            sourceContainer.splice(oldIndex, 1);
          }
          // if active item source is a group
        } else {
          const sourceContainer = newBoardData[columnFrom][groupFrom].items;
          const oldItem = sourceContainer.find((i) => i.id === activeId);
          const oldIndex = sourceContainer.indexOf(oldItem);

          // and active item destination is also a group
          if (groupTo !== undefined) {
            let destinationContainer = newBoardData[columnTo][groupTo].items;
            const overItem = destinationContainer.find((i) => i.id === over.id);
            const overIndex = destinationContainer.indexOf(overItem);

            // source and destination are the same group
            if (groupFrom === groupTo) {
              console.log("MOVE ITEM INSIDE GROUP");
              destinationContainer = arrayMove(
                destinationContainer,
                oldIndex,
                overIndex
              );
            } else {
              console.log("MOVE ITEM BETWEEN DIFFERENT GROUPS");
              destinationContainer.splice(overIndex, 0, oldItem);
              sourceContainer.splice(oldIndex, 1);
            }
          }
          // but active item destination is not a group
          else {
            console.log("MOVE ITEM OUTSIDE OF ITS GROUP");
            const overItem = newBoardData[columnTo].find(
              (i) => i.id === over.id
            );
            const overIndex = newBoardData[columnTo].indexOf(overItem);
            newBoardData[columnTo].splice(overIndex, 0, oldItem);
            sourceContainer.splice(oldIndex, 1);
          }
        }
      }
      // if current columnId different than destination columnId, move active item to new column array
      // else if (columnFrom !== columnTo) {
      else {
        const newBoardData = boardData;

        const sourceContainer =
          groupFrom !== undefined
            ? newBoardData[columnFrom][groupFrom].items
            : newBoardData[columnFrom];

        let destinationContainer =
          groupTo !== undefined
            ? newBoardData[columnTo][groupTo].items
            : newBoardData[columnTo];

        console.log(
          "sourceContainer: ",
          sourceContainer,
          " destinationContainer: ",
          destinationContainer
        );

        const oldItem = sourceContainer.find((i) => i.id === activeId);
        const oldIndex = sourceContainer.indexOf(oldItem);

        const overItem = destinationContainer.find((i) => i.id === over.id);
        const overIndex = destinationContainer.indexOf(overItem);

        // group dragged over group -> merge
        if (oldItem.type === "group" && overItem.type === "group") {
          overItem.items = [...overItem.items, ...oldItem.items];
        }
        // group dragged over grouped item -> merge
        else if (oldItem.type === "group" && groupTo !== undefined) {
          newBoardData[columnTo][groupTo].items = [
            ...destinationContainer,
            ...oldItem.items,
          ];
        }
        // basic card movement
        else {
          destinationContainer.splice(overIndex, 0, oldItem);
        }
        sourceContainer.splice(oldIndex, 1);
      }

      // remove empty group (if there is one)
      const emptyGroup = newBoardData[columnFrom].find(
        (i) => i.type === "group" && i.items.length === 0
      );
      if (emptyGroup) {
        const emptyGroupIndex = newBoardData[columnFrom].indexOf(emptyGroup);
        newBoardData[columnFrom].splice(emptyGroupIndex, 1);
      }

      console.log("NEW BOARD DATA: ", newBoardData);
      setBoardData(newBoardData);
      setActiveId(undefined);
    }
  }

  function handleDragOver(event) {
    // DO SOMETHING WHILE DRAGGING
  }

  /**
   * Helper function for handleDragEnd and handleDragOver to find place of an item inside the board data.
   *
   * @param {string} itemId id of the item we are looking for.
   * @return {Array[2]} An array containing [colunIndex, groupIndex]. If a group or column wasn't found, returns undefined values (if only columnIndex has a value, the item is not in a group).
   * @see handleDragEnd, handleDragOver, boardData
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
      if (group !== undefined) break;
    }
    console.log("findItem results for ", itemId, " are: ", [column, group]);
    return [column, group];
  }
};
