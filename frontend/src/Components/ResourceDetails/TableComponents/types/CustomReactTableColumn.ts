import { Column } from "react-table"

export type CustomReactTableColumn<T extends object> = Column<T> & {
  defaultValue?: string | number | boolean
}