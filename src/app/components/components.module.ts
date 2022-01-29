import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material/material.module";
import { GameCardComponent } from "./game-card/game-card.component";
import { RestartDialogComponent } from "./restart-dialog/restart-dialog.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    GameCardComponent,
    RestartDialogComponent
  ],
  exports: [
    GameCardComponent,
    RestartDialogComponent
  ],
})
export class ComponentsModule {}
