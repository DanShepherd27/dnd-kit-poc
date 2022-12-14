import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as S from "./Group.styled";
import { Card } from "./Card";
import { SortableContext } from "@dnd-kit/sortable/dist/index";

export const Group = ({ groupName, id, items }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <S.Group ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p>{`${groupName} (${items.length})`}</p>

      {items.map((item) =>
        item.type === "card" ? (
          <Card id={item.id} key={item.id}>
            {item.title}
          </Card>
        ) : (
          <Group
            id={item.id}
            key={item.id}
            items={item.items}
            groupName={item.groupName}
          />
        )
      )}
    </S.Group>
  );
};
