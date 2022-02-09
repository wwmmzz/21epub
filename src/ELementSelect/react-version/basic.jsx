import React, { useRef, useState, useEffect } from "react";
import './style.less'
import { App } from "./components/editor-with-mask";
import { itemGroup } from "../data";

export default () => {
  

  const handleMove = (e) => {

    const deltaX = Math.abs(e.pageX - cont.current.offsetLeft - pos.current[0]);
    const deltaY = Math.abs(e.pageY - cont.current.offsetTop - pos.current[1]);

    const ePos = [
      Math.min(pos.current[0], e.pageX - cont.current.offsetLeft),
      Math.min(pos.current[1], e.pageY - cont.current.offsetTop),
    ];

    draw.current = square(ePos, [deltaX, deltaY]);

    draw.current.item = {
      pos: ePos,
      size: [deltaX, deltaY],
    };

    setMask(draw.current.item);

    const squareGroup = itemGroup.map((item) => ({
      current: square(item.pos, item.size),
      item,
    }));

    const point = squareGroup.filter(
      (item) =>
        isIntersect(item.current.v1, draw.current.h1) ||
        isIntersect(item.current.v1, draw.current.h2) ||
        isIntersect(item.current.v2, draw.current.h1) ||
        isIntersect(item.current.v2, draw.current.h2) ||
        isIntersect(draw.current.v1, item.current.h1) ||
        isIntersect(draw.current.v2, item.current.h1) ||
        isIntersect(draw.current.v1, item.current.h2) ||
        isIntersect(draw.current.v2, item.current.h2) ||
        isContainal(draw.current, item)
    );

    if (point.length) {
      const select = itemGroup.map((item) => {
        if (point.find((p) => p.item.id === item.id)) {
          return {
            ...item,
            actived: true,
          };
        } else {
          return item;
        }
      });

      setGroup(select);
      selectItem.current = {
        id: point.map((item) => item.item.id),
        value: point.map((item) => item.item.value),
      };
    }
  };

  const square = (pos, size) => {
    const [x, y] = pos;
    const [w, h] = size;

    const lineGroup = {
      h1: [
        [x, y],
        [x + w, y],
      ],
      h2: [
        [x, y + h],
        [x + w, y + h],
      ],
      v1: [
        [x, y],
        [x, y + h],
      ],
      v2: [
        [x + w, y],
        [x + w, y + h],
      ],
    };

    return lineGroup;
  };

  const isIntersect = (v, h) => {
    return (
      v[0][0] >= h[0][0] &&
      v[0][0] <= h[1][0] &&
      h[0][1] >= v[0][1] &&
      h[0][1] <= v[1][1]
    );
  };

  const isContainal = (square1, square2) => {
    return (
      square1.item.pos[0] < square2.item.pos[0] &&
      square1.item.pos[1] < square2.item.pos[1] &&
      square1.item.size[0] + square1.item.pos[0] >
        square2.item.pos[0] + square2.item.size[0] &&
      square1.item.size[1] + square1.item.pos[1] >
        square2.item.pos[1] + square2.item.size[1]
    );
  };

  const handleUP = (e) => {
    console.table(selectItem.current);

    setGroup(itemGroup);
    setMask(null);

    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleUP);
  };

  const handleDown = (e) => {
    pos.current = [e.pageX - cont.current.offsetLeft, e.pageY - cont.current.offsetTop];

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUP);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDown);
  }, []);

  const pos = useRef([0, 0]);

  const draw = useRef();

  const selectItem = useRef();

  const cont = useRef()

  const [group, setGroup] = useState(itemGroup);

  const [mask, setMask] = useState(null);

  return (
    <div id="containal" ref={cont}>
  <App itemGroup={group} mask={mask} />;

    </div>
  )
};
