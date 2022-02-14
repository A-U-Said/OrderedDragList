type dragChild = {
    name: string;
    value?: string;
}
  
type dragList = {
    name: string;
    value?: string;
    children?: dragChild[];
}

type transferItem = {
    originList: string;
    oldIndex: number;
    data: dragChild;
}