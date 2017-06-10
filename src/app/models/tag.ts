export class Tag {
    tag: string;

    constructor(tag: string){
        this.tag = tag;
    }

    getPlain(){
        return this.tag;
    }
};

export function TagTransform(tags: string[]): Tag[] {
    let result: Tag[] = [];
    for(let tag of tags){
        result.push(new Tag(tag));
    }
    return result;
}

export function InverseTagTransform(tags: Tag[]): string[] {
    let result: string[] = [];
    for(let tag of tags){
        result.push(tag.tag);
    }
    return result;
}