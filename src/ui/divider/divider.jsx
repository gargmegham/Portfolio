import { classes, cssProps, numToMs } from "@/utils/style";
import styles from "./divider.module.css";

export const Divider = ({ collapseDelay, collapsed, className, ...rest }) => (
  <div className={classes(styles.divider, className)} {...rest}>
    <div className={styles.line} data-collapsed={collapsed} />
    <div
      className={styles.notch}
      style={cssProps({ collapseDelay: numToMs(collapseDelay + 160) })}
    />
  </div>
);

Divider.defaultProps = {
  collapsed: false,
  collapseDelay: 0,
};
