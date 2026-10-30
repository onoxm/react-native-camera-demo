import { cssInterop } from "nativewind";
import type { ComponentPropsWithRef, ComponentType } from "react";

export function createStyledComponent<C extends ComponentType<any>>(
  component: C,
) {
  // cssInterop 的 mapping/返回值类型都无法在泛型 C 上展开：入参放宽，ref 由 ComponentPropsWithRef 补回
  return cssInterop(component as ComponentType<any>, {
    className: "style",
  }) as ComponentType<ComponentPropsWithRef<C> & { className?: string }>;
}
