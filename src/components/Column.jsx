import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";
import * as S from "./Column.styled";
import { Card } from "./Card";
import { Group } from "./Group";

export const Column = ({ items, id }) => {
  return (
    <S.Column>
      <SortableContext items={items} strategy={rectSwappingStrategy}>
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
      </SortableContext>
    </S.Column>
  );
};
