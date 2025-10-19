import { Module } from "@nestjs/common";
import { UserInteractionManager } from "./userInteractionManager";

@Module({
  providers: [UserInteractionManager],
  exports: [UserInteractionManager],
})
export class UserInteractionManagerModule {}
