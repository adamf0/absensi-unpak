export interface TableItemStrategy {
    render(data: any, index:number): JSX.Element;
} 