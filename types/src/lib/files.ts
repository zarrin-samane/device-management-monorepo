import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class File {
  id: any;
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  path: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
