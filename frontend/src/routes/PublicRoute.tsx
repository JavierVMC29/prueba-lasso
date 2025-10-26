interface Props {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: Props) => {
  return <>{children}</>;
};

export default PublicRoute;
