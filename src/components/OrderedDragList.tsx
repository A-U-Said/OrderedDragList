import { useState, useEffect, DragEvent } from "react";

type orderedDragListProps = {
    childLists: dragList[];
    callback?: Function;
};

const OrderedDragList = ({childLists, callback} : orderedDragListProps): JSX.Element => {

    const [orderedDragLists, setOrderedDragLists] = useState<dragList[]>(childLists);
    const [transferItem, setTransferItem] = useState<transferItem>({ originList: "", oldIndex: -1, data:{name: "", value: ""} });

    useEffect(() =>{
        setOrderedDragLists(childLists);
    },[childLists])

    const getListItemIndex = (target: Element): number => {
        let itemIndex: number = 0;
        while ( target.previousElementSibling ) {
            target = target.previousElementSibling;
            itemIndex += 1;   
        }
        return itemIndex;
    }

    const outOfBoundsDrop = (): void => {
        setTransferItem({ originList: "", oldIndex: -1, data:{name: "", value: ""} });
    }

    const dragStartHandle = (target: Element, listName: string, listItem: dragChild): void => {
        document.addEventListener("dragend", outOfBoundsDrop);
        setTransferItem({originList: listName, oldIndex: getListItemIndex(target), data: listItem});
    }

    const dragHandle = (e: DragEvent<HTMLUListElement>): void => {
        e.preventDefault();
    }

    const dropHandle = (target: Element, destinationListName: string): void => {
        document.removeEventListener("dragend", outOfBoundsDrop); 
        if (destinationListName && Object.keys(transferItem).length !== 0) {
            const stateClone: dragList[] = [...orderedDragLists];
            const destinationListObjectIndex: number = stateClone.findIndex(list => list.name === destinationListName);
            const originListObjectIndex: number = stateClone.findIndex(list => list.name === transferItem.originList);
            const destinationListClone: dragList = {...stateClone[destinationListObjectIndex]};
            const originListClone: dragList = {...stateClone[originListObjectIndex]};
            const destinationChildren: dragChild[] = [...destinationListClone.children!];
            if (target.tagName === "LI") {
                const newIndex: number = getListItemIndex(target);
                if (transferItem.originList === destinationListName) {
                    destinationChildren.splice(newIndex, 0, destinationChildren.splice(transferItem.oldIndex, 1)[0]);
                    destinationListClone.children = destinationChildren;
                    stateClone[destinationListObjectIndex] = destinationListClone;
                    setOrderedDragLists(stateClone);
                } else {
                    destinationChildren.splice(newIndex, 0, transferItem.data);
                    destinationListClone.children = destinationChildren;
                    const newChildren: dragChild[] = originListClone.children!.filter(oldItem => oldItem !== transferItem.data);
                    originListClone.children = newChildren;
                    stateClone[destinationListObjectIndex] = destinationListClone;
                    stateClone[originListObjectIndex] = originListClone;
                    setOrderedDragLists(stateClone);
                }
            } else {
                if (transferItem.originList !== destinationListName) {
                    stateClone[destinationListObjectIndex] = {...destinationListClone, children:[...destinationListClone.children!, transferItem.data]};
                    const newChildren: dragChild[] = originListClone.children!.filter(oldItem => oldItem !== transferItem.data);
                    originListClone.children = newChildren;
                    stateClone[originListObjectIndex] = originListClone;
                    setOrderedDragLists(stateClone);
                }
            }
        }
        setTransferItem({ originList: "", oldIndex: -1, data:{name: "", value: ""} });
    }

    return (
        <>
        <div className="drag-list-container">        
            {
                orderedDragLists.map((list, listIndex) => (
                    <div className="list-with-header" key={listIndex}>
                        <h3 className="list-header">{list.name}</h3>
                        <hr className="solid"/>
                        <ul className='dragList' id={list.name} onDragOver={dragHandle} onDrop={(e) => dropHandle(e.target as Element, list.name)}>
                            { (list.children) && list.children.map((listItem, listItemIndex) =>
                                <li draggable key={listItemIndex} id={listItem.name} className="drag-list-item" onDragStart={(e) => dragStartHandle(e.target as Element, list.name, listItem)}>{listItem.name}</li>
                            )}
                        </ul>
                    </div>
                ))
            }
        </div>
            { callback && <button className="callback-button" type="button" onClick={e => callback(orderedDragLists)}>Export list structure</button> }
        </>
    );
}

export default OrderedDragList;