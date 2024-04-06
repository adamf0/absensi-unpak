export class Approval {
  id: string;
  type: string;
  note: string|null;
  execute: boolean;
  
  constructor(
      execute: boolean = false,
      id: string,
      type: string,
      note: string|null = null,
  ) {
      this.id = id;
      this.type = type;
      this.note = note;
      this.execute = execute
  }
}