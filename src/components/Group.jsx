import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as S from "./Group.styled";
import { Card } from "./Card";

export const Group = ({ groupName, id, cards }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log("CARDS OF GROUP: ", cards);
  return (
    <S.Group ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p>{groupName}</p>
      {cards.map((card) => (
        <Card id={card.id} key={card.id}>
          {card.title}
        </Card>
      ))}
    </S.Group>
  );
};
