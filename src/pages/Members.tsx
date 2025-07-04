import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Phone, Mail, MapPin } from 'lucide-react';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with real data from Supabase
  const members = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@email.com',
      phone: '(555) 123-4567',
      role: 'member',
      joinDate: '2024-01-15',
      lastVisit: '2024-01-20',
      totalSpent: 450.75,
      avatar: null,
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@email.com',
      phone: '(555) 987-6543',
      role: 'staff',
      joinDate: '2023-12-01',
      lastVisit: '2024-01-21',
      totalSpent: 1250.00,
      avatar: null,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@email.com',
      phone: '(555) 456-7890',
      role: 'member',
      joinDate: '2024-01-10',
      lastVisit: '2024-01-19',
      totalSpent: 275.50,
      avatar: null,
    },
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'staff': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <MobileLayout title="Members">
      <div className="p-4 space-y-4">
        {/* Search and Add */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate">{member.name}</h3>
                    <Badge variant={getRoleColor(member.role)} className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="h-3 w-3 mr-1" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Total: ${member.totalSpent.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last visit: {new Date(member.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Member Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{members.length}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {members.filter(m => m.role === 'staff').length}
                </p>
                <p className="text-xs text-muted-foreground">Staff</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  ${members.reduce((sum, m) => sum + m.totalSpent, 0).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Members;