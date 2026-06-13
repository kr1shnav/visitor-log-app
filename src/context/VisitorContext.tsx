import React, { createContext, useContext, useState } from 'react';

type VisitorStatus =
  | 'ACTIVE'
  | 'CHECKED_OUT';

export type Visitor = {
  id: string;
  fullName: string;
  designation: string;
  companyName: string;
  mobileNo: string;
  purpose: string;
  vehicleNo: string;
  remarks: string;

  inTime: string;
  outTime?: string;

  image?: string | null;
  idCardImage?: string | null;

  status: VisitorStatus;
};

type VisitorContextType = {
  visitors: Visitor[];

  addVisitor: (visitor: Visitor) => void;

  checkoutVisitor: (id: string) => void;
};

const VisitorContext = createContext<VisitorContextType | null>(null);

export const VisitorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  // Add Visitor
  const addVisitor = (visitor: Visitor) => {
    setVisitors((prev) => [visitor, ...prev]);
  };

  // Checkout Visitor
  const checkoutVisitor = (id: string) => {
    const updatedVisitors = visitors.map((visitor) => {
      if (visitor.id === id && visitor.status === 'ACTIVE') {
        return {
          ...visitor,
          status: 'CHECKED_OUT' as const,
          outTime: new Date().toLocaleTimeString(),
        };
      }

      return visitor;
    });

    setVisitors(updatedVisitors);
  };

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        addVisitor,
        checkoutVisitor,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => {
  const context = useContext(VisitorContext);

  if (!context) {
    throw new Error('useVisitor must be used inside VisitorProvider');
  }

  return context;
};
