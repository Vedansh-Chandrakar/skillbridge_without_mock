import { useRole } from '@/hooks';

/**
 * RBAC gate — only renders children if the user's effective role
 * is included in the `allowed` list.
 *
 * @param {Object}   props
 * @param {string[]} props.allowed  – e.g. ['admin','campus']
 * @param {React.ReactNode} [props.fallback] – shown when access denied
 * @param {React.ReactNode} props.children
 */
export function RoleGate({ allowed = [], fallback = null, children }) {
  const { hasAccess } = useRole();
  return hasAccess(allowed) ? children : fallback;
}
